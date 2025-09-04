import express from "express";
import {
  createBooking, getUserBookings, cancelBooking, getStationBookings, updateBookingStatus,
} from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// User
router.post("/", authMiddleware, authorizeRoles("USER", "ADMIN"), createBooking);
router.get("/", authMiddleware, authorizeRoles("USER", "ADMIN"), getUserBookings);
router.delete("/:id", authMiddleware, authorizeRoles("USER", "ADMIN"), cancelBooking);

// Admin
router.get("/station/:stationId", authMiddleware, authorizeRoles("ADMIN"), getStationBookings);
router.patch("/:id/status", authMiddleware, authorizeRoles("ADMIN"), updateBookingStatus);

export default router;
