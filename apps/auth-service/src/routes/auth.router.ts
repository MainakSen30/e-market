import express, { Router } from "express";
import {
  loginUser,
  userRegistration,
  verifyUser,
  forgotPassword,
  veriyUserForgotPassword,
  resetPassword,
  refreshTokenUser,
  getUser,
} from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware";

const router: Router = express.Router();

// Registration flow
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);

// Login
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshTokenUser);
router.get("/logged-in-user", isAuthenticated, getUser);

// Forgot password flow
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", veriyUserForgotPassword);
router.post("/reset-password-user", resetPassword);

export default router;
