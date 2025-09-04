// src/controllers/usageController.js
import prisma from "../config/prismaClient.js";

// ✅ Get all usage logs
export const getUsageLogs = async (_req, res) => {
  try {
    const logs = await prisma.usageLog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
