import { Router } from "express";
import { getProjectLogs, getGlobalLogs } from "../controllers/auditLog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/global", getGlobalLogs);
router.get("/project/:projectId", getProjectLogs);

export default router;
