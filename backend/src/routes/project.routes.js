import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  rotateKeys, // ADD THIS IMPORT
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 Protect all project routes
router.use(verifyJWT);

/* ------------------- PROJECT ROUTES ------------------- */

// ➕ Create project
router.post("/", createProject);

// 📄 Get all projects for logged-in developer
router.get("/", getProjects);

// 📄 Get single project (with ID validation)
router.get("/:projectId", getProject);

// ✏ Update project (PATCH = partial update)
router.patch("/:projectId", updateProject);

// 🔄 Rotate project keys - ADD THIS ROUTE
router.post("/:projectId/rotate-keys", rotateKeys);

// 🗑 Delete project
router.delete("/:projectId", deleteProject);

export default router;