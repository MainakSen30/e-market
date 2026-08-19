import { AuthError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return next(new AuthError("Unauthorized! Token missing"));
        }

        // verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
            id: string;
            role: "user" | "seller";
        };

        if (!decodedToken || !decodedToken.id) {
            return next(new AuthError("Unauthorized or Invalid Token!"));
        }

        // search for the user
        const userAccount = await prisma.users.findUnique({
            where: {
                id: decodedToken.id,
            },
        });

        if (!userAccount) {
            return next(new AuthError("Unauthorized! User not found"));
        }

        req.user = userAccount;
        return next();
    } catch (error) {
        return next(new AuthError("Unauthorized! Token expired or Invalid Token"));
    }
};

export default isAuthenticated;
