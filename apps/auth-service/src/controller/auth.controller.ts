import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequest, validateRegistrationData } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";

//Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //Validate the data from the body
        validateRegistrationData(req.body, "user")
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: email
        });

        if(existingUser) {
            return next(new ValidationError("User already exists with this email"));
        };

        await checkOtpRestrictions(email, next);

        //Tracking OTP request
        await trackOtpRequest(email, next);

        //Send the otp after that
        await sendOtp(email, name, "user-activation-mail")

        //send a response
        res.status(200).json({
            message: "OTP sent to your email. Please verify your account"
        });
    } catch (error) {
        return next(error);
    }
}
