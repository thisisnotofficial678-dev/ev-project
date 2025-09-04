import express from "express";
import { getUsageLogs } from "../controllers/usageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin-only logs
router.get("/logs", authMiddleware, authorizeRoles("ADMIN"), getUsageLogs);

export default router;
