// src/controllers/notificationController.js
import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notificationService.js";

// get my notifications
export const getMyNotificationsController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// mark as read
export const markAsReadController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    await markNotificationAsRead(parseInt(id), userId);

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// admin sends notification
export const sendNotificationController = async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ message: "userId and title are required" });
    }

    const notification = await createNotification(
      userId,
      title,
      body,
      req.io,
      req.userSockets
    );

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
