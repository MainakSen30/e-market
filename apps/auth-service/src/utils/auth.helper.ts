import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction } from "express";
import redis from "../../../../packages/libs/redis";

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

}

const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt( 1000, 9999 ).toString();
    await sendEmail();
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
