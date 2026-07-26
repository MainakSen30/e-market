import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction } from "express";
import redis from "../../../../packages/libs/redis";
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
            new ValidationError("Too many OTP requests! Please try again in an hour.")
        );
    }

    /*
        OTP cooldown
        Restricting the requesting of OTP for 1 min after the first OTP is sent
    */
    if (await redis.get(`otp_cooldown: ${email}`)) {
        return next(
            new ValidationError("Please wait a minute before asking for another OTP.")
        )
    }
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
