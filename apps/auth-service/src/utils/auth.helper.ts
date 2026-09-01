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
export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller",
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields!`);
  }

  if (!emailReqex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

// Checks whether the given email is currently under any OTP-related restriction.
//   1. otp_spam_lock — triggered after 3 consecutive wrong OTP attempts (1 hr lock)
//   2. otp_cooldown  — enforces a 1 minute gap between consecutive OTP send requests
export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_spam_lock: ${email}`)) {
    throw new ValidationError(
      "Too many failed OTP attempts! Please try again in 1 hour.",
    );
  }

  if (await redis.get(`otp_cooldown: ${email}`)) {
    throw new ValidationError(
      "Please wait 1 minute before asking for another OTP.",
    );
  }
};

// Generates a 4-digit OTP, sends it via email using the given template,
// then stores it in Redis with a 5 minute expiry.
// Also sets a 1 minute cooldown to prevent back-to-back OTP send requests.
export const sendOtp = async (
  name: string,
  email: string,
  template: string,
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, undefined, template, { name, otp });

  // Store the OTP in Redis — expires after 5 minutes
  await redis.set(`otp: ${email}`, otp, "EX", 300);

  // Prevent the user from requesting another OTP for 1 minute
  await redis.set(`otp_cooldown: ${email}`, "true", "EX", 60);
};

// Verifies the submitted OTP against what is stored in Redis for the given email.
// Wrong OTP increments otp_request_count; 3 failures trigger a 1 hour spam lock.
// Successful verification resets the count to 0.
export const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp: ${email}`);

  // OTP not found — either it expired or was never generated
  if (!storedOtp) {
    throw new ValidationError("Invalid or expired OTP!");
  }

  const otpCountKey = `otp_request_count: ${email}`;

  if (storedOtp !== otp) {
    const currentCount = parseInt((await redis.get(otpCountKey)) || "0");
    const newCount = currentCount + 1;

    if (newCount >= 3) {
      // 3 wrong attempts — spam-lock for 1 hour and clear OTP state
      await redis.set(`otp_spam_lock: ${email}`, "locked", "EX", 3600);
      await redis.del(`otp: ${email}`, otpCountKey);
      throw new ValidationError(
        "Too many failed attempts. Please try again in 1 hour.",
      );
    }

    await redis.set(otpCountKey, newCount, "EX", 3600);
    throw new ValidationError(
      `Incorrect OTP. You have ${3 - newCount} attempt(s) remaining.`,
    );
  }

  // OTP matched — clear OTP and reset the failure count
  await redis.del(`otp: ${email}`, otpCountKey);
};

// Handles the forgot password initiation for both users and sellers.
// Verifies the account exists, enforces OTP restrictions, and dispatches a reset OTP email.
export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller",
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new ValidationError("Email is required.");
    }

    // Look up the account by email based on the userType
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({
        where: { email },
      }));
    if (!user) {
      throw new ValidationError(`${userType} not found!`);
    }

    // Enforce cooldown / spam-lock before dispatching the reset email
    await checkOtpRestrictions(email);

    // Send the password reset OTP
    await sendOtp(user.name, email, "user-forgot-password-email");

    res.status(200).json({
      message: "OTP sent to your email. Please verify to reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

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
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};
