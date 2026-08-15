import { Router } from "express";
import {
  getAnalyticsOverview,
  getAnalyticsCharts,
  getRecentActivity,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { trackSessionActivity } from "../middlewares/sessionTracker.js";

const router = Router();

// All analytics routes require authentication
router.use(verifyJWT);
router.use(trackSessionActivity);

router.get("/:projectId/overview", getAnalyticsOverview);
router.get("/:projectId/charts", getAnalyticsCharts);
router.get("/:projectId/recent-activity", getRecentActivity);

export default router;
