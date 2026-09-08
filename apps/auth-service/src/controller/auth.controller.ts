import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  validateRegistrationData,
  verifyOtp,
  verifyForgotPasswordOtp,
} from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";

// Initiates the registration flow for a new user.
// Validates the request body, ensures the email isn't already taken,
// enforces OTP restrictions, and sends a verification OTP to the user's email.
// The user is NOT persisted to the DB at this stage.
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    // Reject if a user with this email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new ValidationError("User already exists with this email"));
    }

    // Enforce cooldown / spam-lock before sending OTP
    await checkOtpRestrictions(email);

    // Send the OTP to the user's email
    await sendOtp(name, email, "user-activation-mail");

    res.status(200).json({
      message: "OTP sent to your email. Please verify your account",
    });
  } catch (error) {
    return next(error);
  }
};

// Completes the registration flow by verifying the OTP sent during userRegistration.
// On successful OTP verification, hashes the password and persists the new user to the DB.
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name } = req.body;

    // All fields are required to complete registration
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("All the fields are required"));
    }

    // Guard against duplicate registrations reaching this step
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(
        new ValidationError(
          "User already exists with this email. Try a new one!",
        ),
      );
    }

    // Validate the OTP — throws if invalid, expired, or too many failed attempts
    await verifyOtp(email, otp);

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist the new user now that the email is verified
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      user,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// Authenticates an existing user with email and password.
// On success, signs and stores access (15m) and refresh (7d) JWTs as httpOnly cookies.
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    // Both credentials are required
    if (!email || !password) {
      return next(
        new ValidationError("Both the email and password are required"),
      );
    }

    // Look up the user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new AuthError("User doesn't exist."));
    }

    // Verify the provided password against the stored hash
    const isMatchingPassword = await bcrypt.compare(password, user.password!);
    if (!isMatchingPassword) {
      return next(new AuthError("Invalid email or password"));
    }

    // Sign a short-lived access token and a long-lived refresh token
    const accessTokenAuth = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );
    const refreshTokenAuth = jwt.sign(
      { id: user.id, role: "user" },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" },
    );

    // Store both tokens in secure httpOnly cookies
    setCookie(res, "refresh_token", refreshTokenAuth);
    setCookie(res, "access_token", accessTokenAuth);

    res.status(200).json({
      message: "Login successfully done.",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// refresh token for the user so that the user can remain logged in
export const refreshTokenUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return next(new AuthError("Unauthorized! No refresh token!"));
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as {
      id: string;
      role: string;
    };

    if (!decoded || !decoded.id || !decoded.role) {
      return next(new JsonWebTokenError("Forbidden! Invalid refresh token!"));
    }

    //ensure whether the seller or user account exists in the database
    //let account;
    //if(decoded.role === "user") {
    const user = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return next(new AuthError("Forbidden! Invalid refresh token!"));
    }

    // sign a new access token
    const accessTokenAuth = jwt.sign(
      { id: user.id, role: "user" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" },
    );
    setCookie(res, "access_token", accessTokenAuth);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

// get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Initiates the forgot password flow by sending an OTP to the user's registered email.
// Delegates to handleForgotPassword in auth.helper with the "user" role.
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await handleForgotPassword(req, res, next, "user");
};

// Verifies the OTP sent during the forgot password flow.
// On success, the client can proceed to the reset password step.
// Delegates to verifyFOrgotPasswordOtp in auth.helper with the "user" role.
export const veriyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// Resets the user's password after OTP verification.
// Ensures the new password is different from the existing one, then updates the DB.
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;

    // Both fields are required to proceed
    if (!email || !newPassword) {
      return next(new ValidationError("Email and new password required!"));
    }

    // Confirm the user exists in the database
    const user = await prisma.users.findUnique({
      where: { email },
    });
    if (!user) {
      return next(new ValidationError("User not found"));
    }

    // Prevent reuse of the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      return next(
        new ValidationError(
          "New password must be different from the previous one.",
        ),
      );
    }

    // Hash and persist the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { email },
      data: { password: newHashedPassword },
    });

    res.status(200).json({
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    return next(error);
  }
};

// Initiates the registration flow for a new seller.
// Validates the request body, ensures the email isn't already taken,
// enforces OTP restrictions, and sends a verification OTP to the seller's email.
// The seller is NOT persisted to the DB at this stage.
export const sellerRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //validate data for the seller received from the body
    validateRegistrationData(req.body, "seller");
    const { name, email } = req.body;

    //check existing seller
    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    //if seller exists, throw a validation error
    if(existingSeller) {
      throw new ValidationError("Seller already exists with this email!");
    }
    await checkOtpRestrictions(email);

    //send Otp after checking otp restrictions
    await sendOtp(name, email, "seller-activation-email");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to register.",
    });
  } catch (error) {
    next(error);
  }
}

// Completes the registration flow by verifying the OTP sent during userRegistration.
// On successful OTP verification, hashes the password and persists the new user to the DB.
// This is the flow for the seller
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, otp, phoneNumber, country } = req.body;

    //check if one or more of them is missing
    if (!name || !email || !password || !otp || !phoneNumber || !country) {
      return next(new ValidationError("All the fields are required"));
    }

    //check existing seller
    const existingSeller = await prisma.sellers.findUnique({
      where: { email }
    });

    //if seller exists, throw an error
    if(existingSeller) {
      return next(new ValidationError("Seller is already registered, Login instead!"));
    }

    // Validate the OTP — throws if invalid, expired, or too many failed attempts
    await verifyOtp(email, otp);

    // Hash the password before saving into the database
    const hashedSellerPassword = await bcrypt.hash(password, 10);

    // Persist the new seller now that the email has been verified
    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedSellerPassword,
        country,
        phone_number: phoneNumber
      }
    });

    res.status(200).json({
      seller,
      success: true,
      message: "Seller registered successfully",
    });


  } catch (error) {
    next(error)
  }
}
