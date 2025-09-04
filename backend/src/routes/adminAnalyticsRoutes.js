// src/routes/adminAnalyticsRoutes.js
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import {
  getRevenueStats,
  getStationUtilization,
  getBookingTrends,
  getTopStations,
  getUserGrowth,
} from "../controllers/adminAnalyticsController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/revenue", getRevenueStats);
router.get("/utilization", getStationUtilization);
router.get("/bookings", getBookingTrends);
router.get("/top-stations", getTopStations);
router.get("/user-growth", getUserGrowth);

export default router;
