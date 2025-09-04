// src/controllers/aiController.js
import prisma from "../config/prismaClient.js";

// Dummy ETA calculation
export const getETA = async (req, res) => {
  try {
    const { stationId, userLat, userLng } = req.query;

    if (!stationId || !userLat || !userLng) {
      return res.status(400).json({ error: "stationId, userLat and userLng are required" });
    }

    const station = await prisma.station.findUnique({
      where: { id: parseInt(stationId) },
    });

    if (!station) {
      return res.status(404).json({ error: "Station not found" });
    }

    // Dummy ETA logic
    const distanceKm = Math.random() * 5 + 1; // random between 1–6 km
    const etaMinutes = Math.round(distanceKm * 2); // 2 mins per km

    res.json({
      stationId: station.id,
      stationName: station.name,
      distanceKm: distanceKm.toFixed(2),
      etaMinutes,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dummy recommendation system
export const recommendStation = async (req, res) => {
  try {
    const { userLat, userLng } = req.query;

    if (!userLat || !userLng) {
      return res.status(400).json({ error: "userLat and userLng are required" });
    }

    const stations = await prisma.station.findMany({
      include: { slots: true },
    });

    if (!stations.length) {
      return res.status(404).json({ error: "No stations available" });
    }

    // Pick station with max free slots (simple heuristic)
    const withFreeSlots = stations.map((s) => ({
      id: s.id,
      name: s.name,
      freeSlots: s.slots.filter((slot) => slot.status === "FREE").length,
    }));

    const recommended = withFreeSlots.reduce((max, curr) =>
      curr.freeSlots > max.freeSlots ? curr : max
    );

    res.json({
      recommended,
      alternatives: withFreeSlots.filter((s) => s.id !== recommended.id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
