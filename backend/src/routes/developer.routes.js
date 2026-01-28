import { Router } from "express";
import {
  registerDeveloper,
  loginDeveloper,
  logoutDeveloper,
  refreshAccessToken,
  getCurrentDeveloper,
  getDashboardStats,
  updateDeveloperProfile,
  deleteDeveloperAccount,
} from "../controllers/developer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerDeveloper);
router.route("/login").post(loginDeveloper);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutDeveloper);
router.route("/me").get(verifyJWT, getCurrentDeveloper);
router.route("/stats").get(verifyJWT, getDashboardStats);

router.route("/profile").put(verifyJWT, updateDeveloperProfile);
router.route("/account").delete(verifyJWT, deleteDeveloperAccount);

export default router;