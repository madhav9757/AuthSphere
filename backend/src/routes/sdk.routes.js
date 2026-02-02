import express from "express";
import {
  authorize,
  token,
  refresh,
  registerLocal,
  loginLocal,
  verifyOTP,
  resendVerification,
} from "../controllers/sdk.controller.js";

import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

/**
 * ============================================================
 * SDK ROUTES
 * Base path: /sdk
 * ============================================================
 */

/**
 * Initiate OAuth flow (browser redirect)
 * GET /sdk/authorize
 */
router.get("/authorize", authorize);

/**
 * Exchange authorization code for tokens
 * POST /sdk/token
 */
router.post("/token", token);

/**
 * Refresh access token using refresh token
 * POST /sdk/refresh
 */
router.post("/refresh", refresh);
router.post("/register", authLimiter, registerLocal);
router.post("/login-local", authLimiter, loginLocal);
router.post("/verify-otp", verifyOTP);
router.post("/resend-verification", resendVerification);

export default router;
