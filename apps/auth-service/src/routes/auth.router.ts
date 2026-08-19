import express, { Router } from "express";
import {
    loginUser,
    userRegistration,
    verifyUser,
    forgotPassword,
    veriyUserResetPassword,
    resetPassword,
    refreshTokenUser
} from "../controller/auth.controller";

const router: Router = express.Router();

// Registration flow
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);

// Login
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshTokenUser)

// Forgot password flow
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", veriyUserResetPassword);
router.post("/reset-password-user", resetPassword);

export default router;
