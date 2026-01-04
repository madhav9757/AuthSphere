import { Router } from "express";

// Route modules
import developerRoutes from "./developer.routes.js";
import projectRoutes from "./project.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

// API base version
const API_PREFIX = "/api/v1";

// Mount versioned API routes
router.use(`${API_PREFIX}/developers`, developerRoutes);
router.use(`${API_PREFIX}/projects`, projectRoutes);

// Auth routes (NO versioning → login URLs stay clean)
router.use(`/auth`, authRoutes);

export default router;
