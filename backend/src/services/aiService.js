import prisma from "../config/prismaClient.js";

// ETA prediction
export const predictETA = async (stationId, userLat, userLng) => {
  const station = await prisma.station.findUnique({ where: { id: Number(stationId) } });
  if (!station) throw new Error("Station not found");

  const dx = station.latitude - userLat;
  const dy = station.longitude - userLng;
  const distance = Math.sqrt(dx * dx + dy * dy) * 111;

  const etaMinutes = Math.round((distance / 40) * 60);

  return {
    stationId,
    stationName: station.name,
    distanceKm: distance.toFixed(2),
    etaMinutes,
  };
};

// Recommendation
export const recommendStation = async (userLat, userLng) => {
  const stations = await prisma.station.findMany({ include: { slots: true } });
  if (!stations.length) throw new Error("No stations found");

  const scored = stations.map((s) => {
    const dx = s.latitude - userLat;
    const dy = s.longitude - userLng;
    const distance = Math.sqrt(dx * dx + dy * dy) * 111;

    const freeSlots = s.slots.filter((sl) => sl.status === "FREE").length;
    return {
      stationId: s.id,
      name: s.name,
      distanceKm: distance.toFixed(2),
      freeSlots,
      score: freeSlots > 0 ? distance : 9999,
    };
  });

  scored.sort((a, b) => a.score - b.score);

  return {
    recommended: scored[0],
    alternatives: scored.slice(1, 3),
  };
};
