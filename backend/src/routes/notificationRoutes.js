// src/routes/notificationRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  sendNotificationController,
  getMyNotificationsController,
  markAsReadController,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get my notifications
router.get("/", authMiddleware, getMyNotificationsController);

// Mark notification as read
router.patch("/:id/read", authMiddleware, markAsReadController);

// Admin send notification
router.post(
  "/send",
  authMiddleware,
  authorizeRoles("ADMIN"),
  sendNotificationController
);

export default router;
