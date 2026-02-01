import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  rotateKeys,
  getProjectUsers,
  deleteProjectUser,
  toggleUserVerification,
  getConfiguredProviders,
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

// 🔄 Rotate project keys
router.post("/:projectId/rotate-keys", rotateKeys);

// 👥 Get project users
router.get("/:projectId/users", getProjectUsers);

// 👥 Delete project user
router.delete("/:projectId/users/:userId", deleteProjectUser);

// 👥 Toggle user verification
router.patch("/:projectId/users/:userId/verify", toggleUserVerification);

// ⚙ Get backend provider configuration
router.get("/:projectId/providers-config", getConfiguredProviders);

// 🗑 Delete project
router.delete("/:projectId", deleteProject);

export default router;