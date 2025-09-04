// src/utils/logger.js
import prisma from "../config/prismaClient.js";

export const logEvent = async (stationId, userId, event) => {
  try {
    await prisma.usageLog.create({
      data: {
        stationId,
        userId,
        event,
      },
    });
  } catch (err) {
    console.error("Error writing usage log:", err.message);
  }
};
