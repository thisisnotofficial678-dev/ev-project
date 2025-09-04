// src/controllers/adminAnalyticsController.js
import prisma from "../config/prismaClient.js";

// 1. Revenue Trends
export const getRevenueStats = async (req, res) => {
  try {
    const revenue = await prisma.payment.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Station Utilization
export const getStationUtilization = async (req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: { slots: true },
    });

    const utilization = stations.map((s) => {
      const total = s.slots.length;
      const occupied = s.slots.filter((slot) => slot.status === "OCCUPIED").length;
      return {
        station: s.name,
        utilization: total > 0 ? (occupied / total) * 100 : 0,
      };
    });

    res.json(utilization);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Booking Trends
export const getBookingTrends = async (req, res) => {
  try {
    const statusCounts = await prisma.booking.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    res.json(statusCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Top Stations
export const getTopStations = async (req, res) => {
  try {
    const top = await prisma.booking.groupBy({
      by: ["stationId"],
      _count: { _all: true },
      orderBy: { _count: { _all: "desc" } },
      take: 5,
    });

    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. User Growth
export const getUserGrowth = async (req, res) => {
  try {
    const growth = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(growth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
