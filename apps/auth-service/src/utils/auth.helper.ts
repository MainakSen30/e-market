import crypto from "crypto";
import { ValidationError } from "@packages/error-handler";
import { NextFunction } from "express";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";

const emailReqex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: "user" | "seller") => {
    const { name, email, password, phone_number, country } = data;

    //Required fields not available
    if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
        throw new ValidationError(`Missing required fields!`)
    }

    //email format validation
    if(!emailReqex.test(email)) {
        throw new ValidationError("Invalid email format!");
    }
}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    /*
        Here we will check the user's email status,
        at first we will have to check whether any otp is locked (entering an otp wrong for more than 3 times)
        The account will be locked for 30 mins after 3 failed attempts
    */
    if (await redis.get(`otp_lock: ${email}`)) {
        return next(
           new ValidationError("Account locked due to multiple falied attempts! Try again after 30 minutes.")
        );
    }

    /*
        OTP spam requests,
        If some user sends too many OTP requests, this restriction will be triggered
    */
    if (await redis.get(`otp_spam_lock: ${email}`)) {
        return next(
            new ValidationError("Too many OTP requests! Please try again in 1 hour.")
        );
    }

    /*
        OTP cooldown
        Restricting the requesting of OTP for 1 min after the first OTP is sent
    */
    if (await redis.get(`otp_cooldown: ${email}`)) {
        return next(
            new ValidationError("Please wait 1 minute before asking for another OTP.")
        )
    }
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    /*
        here we would need an OTP request key
        after getting the OTP request key, if there are more than 2 requests done by the user, the user's acc will be locked for an hour
    */
    const otpRequestKey = `otp_request_count: ${email}`
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock: ${email}`, "locked", "EX", 3600); //Here is the one hour lock
        return next(
            new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again.")
        );
    }

    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt( 1000, 9999 ).toString();
    await sendEmail(email, "Verify your Email", template, { name, otp });
    /*
        We will send an Otp to the given email, and we will save the email and the otp, along with an expiry date to a redis database
        we will add 300s as the redis database expiry time, till then the Otp will be stored in the redis databse
        after that, the otp which has been sent right now will be deleted
    */
    await redis.set(`otp: ${email}`, otp, "EX", 300);

    /*
        This is the logic for the otp cooldown,
        basically a user can send an otp in every one minute hence the 60 second cooldown
    */
    await redis.set(`otp_cooldown: ${email}`, "true", "EX", 60);

}

export const verifyOtp = async (email: string, otp: string) => {
    /*
        In this function, the newly registered user's accout credential such as the email is validated.
        First step is to get the OTP stored in our redis database
        Second step is to store all the failed attempts
    */
    const storedOtp = await redis.get(`otp: ${email}`);
    //check the stored OTP
    if (!storedOtp) {
        throw new ValidationError("Invalid or expired OTP!")
    }
    //store failed attempts
    const failedAttemptsKey = `otp_attempts: ${email}`
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0")

    if (storedOtp != otp) {
        if(failedAttempts >= 2) {
            await redis.set(`otp_lock: ${email}`, "locked", "EX", 1800); //lock for 30 mins
            await redis.del(`otp: ${email}`, failedAttemptsKey);
            throw new ValidationError("Too many failed attempts, account locked for 30 mins")
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300)
        throw new ValidationError(`incorrect OTP! You have ${2 - failedAttempts} attempts remaining.`)
    }

    await redis.del(`otp: ${email}`, failedAttemptsKey);
}
