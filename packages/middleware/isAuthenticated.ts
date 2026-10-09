import { AuthError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies["user-access-token"] || req.cookies["seller-access-token"] || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AuthError("Unauthorized! Token missing"));
    }

    // verify token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as {
      id: string;
      role: "user" | "seller";
    };

    if (!decodedToken || !decodedToken.id) {
      return next(new AuthError("Unauthorized or Invalid Token!"));
    }

    let account;
    if (decodedToken.role === "user") {
      account = await prisma.users.findUnique({
        where: {
          id: decodedToken.id,
        },
      });

      req.user = account;
    } else if (decodedToken.role === "seller") {
      account = await prisma.sellers.findUnique({
        where: {
          id: decodedToken.id,
        },
        include: {
          shop: true
        }
      });

      req.seller = account;
    }

    if (!account) {
      return next(new AuthError("Unauthorized! Account not found"));
    }

    req.role = decodedToken.role;
    return next();
  } catch (error) {
    return next(new AuthError("Unauthorized! Token expired or Invalid Token"));
  }
};

export default isAuthenticated;
