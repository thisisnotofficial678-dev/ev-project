// src/controllers/adminController.js
import prisma from "../config/prismaClient.js";

// --------- Analytics ---------
export const getRevenueStats = async (req, res) => {
  try {
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    const paymentsByStatus = await prisma.payment.groupBy({
      by: ["status"],
      _count: { _all: true },
      _sum: { amount: true },
    });

    res.json({ totalRevenue, paymentsByStatus });
  } catch (error) {
    console.error("Error in getRevenueStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStationUsage = async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: {
        _count: { select: { bookings: true, slots: true } },
        slots: { select: { status: true } },
      },
    });

    res.json(stations);
  } catch (error) {
    console.error("Error in getStationUsage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const usersByRole = await prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    });

    res.json({ totalUsers, usersByRole });
  } catch (error) {
    console.error("Error in getUserStats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --------- Station Management ---------
export const createStation = async (req, res) => {
  try {
    const { name, location, latitude, longitude, totalSlots } = req.body;

    const newStation = await prisma.station.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        totalSlots,
      },
    });

    res.status(201).json(newStation);
  } catch (error) {
    console.error("Error in createStation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, latitude, longitude, totalSlots } = req.body;

    const updatedStation = await prisma.station.update({
      where: { id: parseInt(id) },
      data: { name, location, latitude, longitude, totalSlots },
    });

    res.json(updatedStation);
  } catch (error) {
    console.error("Error in updateStation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deactivateStation = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedStation = await prisma.station.update({
      where: { id: parseInt(id) },
      data: { location: "DEACTIVATED" }, // or add a `status` field in schema if you want
    });

    res.json({ message: "Station deactivated", station: updatedStation });
  } catch (error) {
    console.error("Error in deactivateStation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// --------- Audit Logs ---------
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.usageLog.findMany({
      orderBy: { timestamp: "desc" }, // UsageLog has timestamp, not createdAt
      take: 50,
      include: {
        station: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(logs);
  } catch (error) {
    console.error("Error in getAuditLogs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
