import { Router } from "express";

// Route modules
import developerRoutes from "./developer.routes.js";
import projectRoutes from "./project.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import sessionRoutes from "./session.routes.js";
import auditLogRoutes from "./auditLog.routes.js";
import authRoutes from "./auth.routes.js";
import sdkRoutes from "./sdk.routes.js";
import notificationRoutes from "./notification.routes.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// API base version
const API_PREFIX = "/api/v1";

// ================================
// Versioned APIs (business logic)
// ================================
router.use(`${API_PREFIX}/developers`, developerRoutes);
router.use(`${API_PREFIX}/projects`, projectRoutes);
router.use(`${API_PREFIX}/analytics`, analyticsRoutes);
router.use(`${API_PREFIX}/sessions`, sessionRoutes);
router.use(`${API_PREFIX}/audit-logs`, auditLogRoutes);
router.use(`${API_PREFIX}/notifications`, notificationRoutes);

// ================================
// Auth routes (OAuth providers)
// ================================
router.use("/auth", authLimiter, authRoutes);

// ================================
// SDK routes (public, unversioned)
// ================================
router.use("/sdk", authLimiter, sdkRoutes);

export default router;
