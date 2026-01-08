import { Router } from "express";

// Route modules
import developerRoutes from "./developer.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.routes.js";
import sdkRoutes from "./sdk.routes.js";

const router = Router();

// API base version
const API_PREFIX = "/api/v1";

// ================================
// Versioned APIs (business logic)
// ================================
router.use(`${API_PREFIX}/developers`, developerRoutes);
router.use(`${API_PREFIX}/projects`, projectRoutes);

// ================================
// Auth routes (OAuth providers)
// ================================
router.use("/auth", authRoutes);

// ================================
// SDK routes (public, unversioned)
// ================================
router.use("/sdk", sdkRoutes);

export default router;
