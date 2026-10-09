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
  sellerRegistration,
  verifySeller,
  createShop,
  createStripeConnectLink,
  loginSeller,
  getLoggedInSeller,
} from "../controller/auth.controller";
import isAuthenticated from "@packages/middleware/isAuthenticated";
import { isSeller, isUser } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

// Registration flow
router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);

// Login
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshTokenUser);
router.get("/logged-in-user", isAuthenticated, isUser, getUser);

// Forgot password flow
router.post("/forgot-password-user", forgotPassword);
router.post("/verify-forgot-password-user", veriyUserForgotPassword);
router.post("/reset-password-user", resetPassword);

// seller routes
router.post("/seller-registration", sellerRegistration);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/create-stripe-link", createStripeConnectLink);
router.post("/login-seller", loginSeller);
router.get("/logged-in-seller",isAuthenticated, isSeller,  getLoggedInSeller);

export default router;
