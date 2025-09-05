// src/controllers/stationController.js
import prisma from "../config/prismaClient.js";
import axios from "axios";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "ml", "usage_logs.csv");

// --- helper: approximate distance (fallback when routing API fails)
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 📌 Helper to append usage logs for ML retraining
function logUsage(stationId, loadFactor, freeSlots, recommended, urgent) {
  const now = new Date();
  const row = [
    now.toISOString(),
    stationId,
    now.getHours(),
    now.getDay(),
    loadFactor,
    freeSlots,
    urgent ? 1 : 0,
    recommended ? 1 : 0,
  ].join(",");

  // Write CSV header if not exists
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(
      LOG_FILE,
      "timestamp,stationId,hour,weekday,loadFactor,freeSlots,urgent,recommended\n"
    );
  }

  fs.appendFileSync(LOG_FILE, row + "\n");
}

// 🔮 Helper: Call ML microservice
async function getPrediction(stationId, loadFactor, freeSlots) {
  try {
    const now = new Date();
    const body = {
      station_id: stationId,
      hour: now.getHours(),
      weekday: now.getDay(),
      current_load: loadFactor,
      free_slots: freeSlots,
    };

    const response = await axios.post("http://localhost:8001/predict", body);
    return response.data.predicted_availability;
  } catch (err) {
    console.error("ML Prediction Error:", err.message);
    return 0.5; // fallback neutral
  }
}

// ✅ Get all stations with slot availability
export const getStations = async (_req, res) => {
  try {
    const stations = await prisma.station.findMany({
      include: { slots: { select: { status: true } } },
    });
    const withAvailability = stations.map((s) => {
      const free = s.slots.filter((x) => x.status === "FREE").length;
      return { ...s, availableSlots: free };
    });
    res.json(withAvailability);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Add a new station (with slots)
export const addStation = async (req, res) => {
  try {
    const { name, location, latitude, longitude, totalSlots } = req.body;
    const station = await prisma.station.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        totalSlots: Number(totalSlots) || 0,
      },
    });

    if (totalSlots && totalSlots > 0) {
      await prisma.slot.createMany({
        data: Array.from({ length: totalSlots }).map((_, i) => ({
          stationId: station.id,
          number: i + 1,
          status: "FREE",
        })),
      });
    }

    const full = await prisma.station.findUnique({
      where: { id: station.id },
      include: { slots: true },
    });

    res.status(201).json(full);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Get station by ID
export const getStationById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const station = await prisma.station.findUnique({
      where: { id },
      include: { slots: true },
    });
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Get slots of a station
export const getStationSlots = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const slots = await prisma.slot.findMany({ where: { stationId: id } });
    res.json(slots);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Update station
export const updateStation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, location, latitude, longitude, totalSlots } = req.body;
    const station = await prisma.station.update({
      where: { id },
      data: { name, location, latitude, longitude, totalSlots },
    });
    res.json(station);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ✅ Delete station
export const deleteStation = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.station.delete({ where: { id } });
    res.json({ message: "Station deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 🚀 Smart Recommendation: One best station (ETA + Load + Urgency + ML Prediction + Logging)
export const getNearestStations = async (req, res) => {
  try {
    const { lat, lng, urgent } = req.query;
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const stations = await prisma.station.findMany({
      include: { slots: true },
    });

    const results = await Promise.all(
      stations.map(async (station) => {
        try {
          // ✅ Use provider-supported mode (drive). Removed traffic=enabled.
          const url = `https://api.geoapify.com/v1/routing?waypoints=${lat},${lng}|${station.latitude},${station.longitude}&mode=drive&apiKey=${apiKey}`;
          const response = await axios.get(url);

          const route = response.data.features[0];
          if (!route) throw new Error("No route found");

          const etaMinutes = Math.round(route.properties.time / 60);
          const distanceKm = (route.properties.distance / 1000).toFixed(2);

          const totalSlots = station.slots.length;
          const freeSlots = station.slots.filter((s) => s.status === "FREE").length;
          const loadFactor = totalSlots > 0 ? (totalSlots - freeSlots) / totalSlots : 1;

          const predictedAvailability = await getPrediction(
            station.id,
            loadFactor,
            freeSlots
          );

          let score =
            etaMinutes * 0.6 +
            loadFactor * 30 +
            parseFloat(distanceKm) * 0.2 -
            predictedAvailability * 10;

          if (urgent === "true") {
            score = etaMinutes * 0.9 + loadFactor * 10 - predictedAvailability * 5;
          }

          return {
            id: station.id,
            name: station.name,
            latitude: station.latitude,
            longitude: station.longitude,
            availableSlots: freeSlots,
            etaMinutes,
            distanceKm,
            loadFactor: loadFactor.toFixed(2),
            predictedAvailability,
            score,
          };
        } catch (error) {
          // ⛑️ Log provider error & use haversine fallback so we don't drop the station entirely
          console.error(
            `ETA error for station ${station.id}:`,
            error?.response?.data ?? error.message ?? error
          );

          try {
            const userLat = Number(lat);
            const userLng = Number(lng);
            const stLat = Number(station.latitude);
            const stLng = Number(station.longitude);

            const distKm = haversineKm(userLat, userLng, stLat, stLng);
            const avgSpeedKmph = 40;
            const etaMinutes = Math.max(1, Math.round((distKm / avgSpeedKmph) * 60));

            const totalSlots = station.slots.length;
            const freeSlots = station.slots.filter((s) => s.status === "FREE").length;
            const loadFactor = totalSlots > 0 ? (totalSlots - freeSlots) / totalSlots : 1;

            const predictedAvailability = await getPrediction(
              station.id,
              loadFactor,
              freeSlots
            );

            let score =
              etaMinutes * 0.6 +
              loadFactor * 30 +
              distKm * 0.2 -
              predictedAvailability * 10;

            if (urgent === "true") {
              score = etaMinutes * 0.9 + loadFactor * 10 - predictedAvailability * 5;
            }

            return {
              id: station.id,
              name: station.name,
              latitude: station.latitude,
              longitude: station.longitude,
              availableSlots: freeSlots,
              etaMinutes,
              distanceKm: distKm.toFixed(2),
              loadFactor: loadFactor.toFixed(2),
              predictedAvailability,
              score,
            };
          } catch (fallbackErr) {
            console.error(`Fallback ETA error for station ${station.id}:`, fallbackErr);
            return null;
          }
        }
      })
    );

    const validStations = results.filter((s) => s !== null);
    if (validStations.length === 0) {
      return res.status(500).json({ error: "Failed to calculate station ETAs" });
    }

    const sortedStations = validStations.sort((a, b) => a.score - b.score);

    const topChoices = sortedStations.slice(0, 2);
    const recommended =
      topChoices.length > 1
        ? topChoices[Math.floor(Math.random() * topChoices.length)]
        : topChoices[0];

    // 📝 Log this recommendation for retraining
    logUsage(
      recommended.id,
      recommended.loadFactor,
      recommended.availableSlots,
      true,
      urgent === "true"
    );

    res.json({
      urgentMode: urgent === "true",
      recommended,
    });
  } catch (error) {
    console.error("Smart Recommendation Error:", error.message);
    res.status(500).json({ error: "Failed to recommend station" });
  }
};
