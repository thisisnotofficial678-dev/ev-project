// src/routes/adminRoutes.js
import express from "express";
import {
  getRevenueStats,
  getStationUsage,
  getUserStats,
  createStation,
  updateStation,
  deactivateStation,
  getAuditLogs,
} from "../controllers/adminController.js";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, authorizeRoles("ADMIN"));

// Analytics
router.get("/stats/revenue", getRevenueStats);
router.get("/stats/stations", getStationUsage);
router.get("/stats/users", getUserStats);

// Station Management
router.post("/stations", createStation);
router.patch("/stations/:id", updateStation);
router.patch("/stations/:id/deactivate", deactivateStation);

// Audit Logs
router.get("/logs", getAuditLogs);

export default router;
