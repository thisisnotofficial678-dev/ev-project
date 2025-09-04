// src/routes/stationRoutes.js
import express from "express";
import {
  getStations,
  addStation,
  getStationById,
  getStationSlots,
  updateStation,
  deleteStation,
  getNearestStations,
} from "../controllers/stationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getStations);
router.get("/nearest", getNearestStations);
router.get("/recommend", getNearestStations); // alias
router.get("/:id", getStationById);
router.get("/:id/slots", getStationSlots);

// Admin
router.post("/", authMiddleware, authorizeRoles("ADMIN"), addStation);
router.patch("/:id", authMiddleware, authorizeRoles("ADMIN"), updateStation);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteStation);

export default router;
