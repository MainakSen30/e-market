import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction, Request, Response } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import prisma from "@packages/libs/prisma";

const emailReqex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validates the registration payload for a user or seller.
// Throws a ValidationError if required fields are missing or the email format is invalid.
// Sellers additionally require phone_number and country.
export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;

    if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
        throw new ValidationError(`Missing required fields!`);
    }

    if (!emailReqex.test(email)) {
        throw new ValidationError("Invalid email format!");
    }
}

// Checks whether the given email is currently under any OTP-related restriction.
// Three checks are enforced in order:
//   1. otp_lock     — triggered after 3 consecutive wrong OTP attempts (30 min lock)
//   2. otp_spam_lock — triggered after too many OTP send requests in a short window (1 hr lock)
//   3. otp_cooldown — enforces a 1 minute gap between consecutive OTP send requests
export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock: ${email}`)) {
        return next(
            new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes.")
        );
    }

    if (await redis.get(`otp_spam_lock: ${email}`)) {
        return next(
            new ValidationError("Too many OTP requests! Please try again in 1 hour.")
        );
    }

    if (await redis.get(`otp_cooldown: ${email}`)) {
        return next(
            new ValidationError("Please wait 1 minute before asking for another OTP.")
        );
    }
}

// Tracks how many OTP send requests have been made for a given email within the last hour.
// If the count reaches 3 or more, the email is spam-locked for 1 hour.
// Otherwise, the request count is incremented and stored with a 1 hour TTL.
export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count: ${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

    if (otpRequests >= 2) {
        // Lock the account for 1 hour due to too many OTP requests
        await redis.set(`otp_spam_lock: ${email}`, "locked", "EX", 3600);
        return next(
            new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again.")
        );
    }

    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
}

// Generates a 4-digit OTP, sends it via email using the given template,
// then stores it in Redis with a 5 minute expiry.
// Also sets a 1 minute cooldown to prevent back-to-back OTP requests.
export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify your Email", template, { name, otp });

    // Store the OTP in Redis — expires after 5 minutes
    await redis.set(`otp: ${email}`, otp, "EX", 300);

    // Prevent the user from requesting another OTP for 1 minute
    await redis.set(`otp_cooldown: ${email}`, "true", "EX", 60);
}

// Verifies the submitted OTP against what is stored in Redis for the given email.
// Tracks failed attempts and enforces a 30 minute lock after 3 consecutive failures.
// Cleans up the OTP and attempt keys from Redis on success.
export const verifyOtp = async (email: string, otp: string) => {
    const storedOtp = await redis.get(`otp: ${email}`);

    // OTP not found — either it expired or was never generated
    if (!storedOtp) {
        throw new ValidationError("Invalid or expired OTP!");
    }

    const failedAttemptsKey = `otp_attempts: ${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            // Lock the account for 30 minutes after 3 wrong attempts
            await redis.set(`otp_lock: ${email}`, "locked", "EX", 1800);
            await redis.del(`otp: ${email}`, failedAttemptsKey);
            throw new ValidationError("Too many failed attempts. Account locked for 30 minutes.");
        }

        // Increment the failed attempt counter — expires alongside the OTP (5 min)
        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        throw new ValidationError(`Incorrect OTP. You have ${2 - failedAttempts} attempt(s) remaining.`);
    }

    // OTP matched — clean up both keys
    await redis.del(`otp: ${email}`, failedAttemptsKey);
}

// Handles the forgot password initiation for both users and sellers.
// Verifies the account exists, enforces OTP restrictions, and dispatches a reset OTP email.
export const handleForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
    userType: "user" | "seller"
) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new ValidationError("Email is required.");
        }

        // Look up the account by email based on the userType
        const user = userType === "user" && await prisma.users.findUnique({
            where: { email }
        });
        if (!user) {
            throw new ValidationError(`${userType} not found!`);
        }

        // Enforce OTP rate limits before dispatching the reset email
        await checkOtpRestrictions(email, next);
        await trackOtpRequest(email, next);

        // Send the password reset OTP
        await sendOtp(user.name, email, "user-forgot-password-email");

        res.status(200).json({
            message: "OTP sent to your email. Please verify to reset your password."
        });
    } catch (error) {
        next(error);
    }
}

// Verifies the OTP submitted during the forgot password flow.
// On success, the client is cleared to proceed to the reset password step.
export const verifyForgotPasswordOtp = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ValidationError("Email and OTP are required.");
        }

        // Reuse the same OTP verification logic used during registration
        await verifyOtp(email, otp);

        res.status(200).json({
            message: "OTP verified. You can now reset your password."
        });
    } catch (error) {
        next(error);
    }
}
