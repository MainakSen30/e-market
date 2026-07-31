import {
    NextFunction,
    Request,
    Response
} from "express";
import {
    checkOtpRestrictions,
    handleForgotPassword,
    sendOtp,
    trackOtpRequest,
    validateRegistrationData,
    verifyOtp
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";

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

//now user login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    /*
        we will need email and password of the registered user
        we would need to check if email or password is not put in the form,
        next we would search if the user is available
        If available then we can login
        or else it is going to be very evident that the user has not registered in the platform and needs to register first
    */
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(
                new ValidationError("Both the email and password are required")
            )
        }

        //user
        const user = await prisma.users.findUnique({
            where: { email }
        });

        if(!user) {
            return next(
                new AuthError("User doesn't exist.")
            );
        }

        //verify password
        const isMatchingPassword = await bcrypt.compare(password, user.password!);
        if(!isMatchingPassword) {
            return next(
                new AuthError("Invalid email or password")
            );
        }

        //Generate access and refresh tokens
        const accessTokenAuth = jwt.sign({
            id: user.id,
            role: "user"
        }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: "15m"
        });

        const refreshTokenAuth = jwt.sign({
            id: user.id,
            role: "user"
        }, process.env.REFRESH_TOKEN_SECRET as string,{
            expiresIn: "7d"
        });

        //store the refresh and access tokens in an httpOnly Secure cookie
        setCookie(res, "refresh_token", refreshTokenAuth);
        setCookie(res, "access_token", accessTokenAuth);

        //send response when everything goes right
        res.status(200).json({
            message: "Login successfully done.",
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        return next(error)
    }
}

//user forgot password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) {
    await handleForgotPassword(req, res, next, "user")
}
