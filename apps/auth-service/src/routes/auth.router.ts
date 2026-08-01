import express, { Router } from "express";
import {
    loginUser,
    userRegistration,
    verifyUser,
    forgotPassword,
    veriyUserResetPassword,
    resetPassword
} from "../controller/auth.controller";

const router: Router = express.Router();

// Registration flow
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);

// Login
router.post("/login-user", loginUser);

// Forgot password flow
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", veriyUserResetPassword);
router.post("/reset-password", resetPassword);

export default router;
