import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, sendOtp, trackOtpRequest, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";

//Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //Validate the data from the body
        validateRegistrationData(req.body, "user")
        const { name, email } = req.body;

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if(existingUser) {
            return next(new ValidationError("User already exists with this email"));
        };

        await checkOtpRestrictions(email, next);

        //Tracking OTP request
        await trackOtpRequest(email, next);

        //Send the otp after that
        await sendOtp(name, email, "user-activation-mail")

        //send a response
        res.status(200).json({
            message: "OTP sent to your email. Please verify your account"
        });
    } catch (error) {
        return next(error);
    }
}

//verify the newly registered user using the otp
export const verifyUser = async (req:Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;
        //check if every field value is provided
        if( !email || !otp || !password || !name ) {
            return next(new ValidationError("All the fields are required"))
        }

        //check if user is existing
        const existingUser = await prisma.users.findUnique({
            where: { email }
        });
        if( existingUser ) {
            return next(new ValidationError("User already exists with this email. Try a new one!"))
        }

        //add the new user to the db after all the checks are done
        await verifyOtp(email, otp)
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(200).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        return next(error);
    }
}
