// src/services/notificationService.js
import prisma from "../config/prismaClient.js";

// create and send notification
export const createNotification = async (userId, title, body, io, userSockets) => {
  const notification = await prisma.notification.create({
    data: { userId, title, body },
  });

  // push via socket if user is online
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit("notification", notification);
    console.log(`📡 Sent real-time notification to user ${userId}`);
  }

  return notification;
};

// fetch user notifications
export const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// mark notification as read
export const markNotificationAsRead = async (id, userId) => {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
};
