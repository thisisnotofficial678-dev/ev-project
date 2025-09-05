import axios from "axios";

// quick haversine fallback
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = v => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const getETAController = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    // Use a provider-supported mode (drive). If you want traffic later, use drive_traffic_approximated
    const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=drive&apiKey=${apiKey}`;

    const response = await axios.get(url);

    const route = response.data.features[0];
    if (!route) {
      return res.status(404).json({ error: "No route found" });
    }

    const distanceMeters = route.properties.distance;
    const timeSeconds = route.properties.time;

    res.json({
      etaMinutes: Math.round(timeSeconds / 60),
      distanceKm: (distanceMeters / 1000).toFixed(2),
      mode: "drive",
      raw: route.properties,
    });
  } catch (error) {
    // log provider error for debugging
    console.error("ETA API Error:", error.response?.data ?? error.message ?? error);

    // fallback: compute approximate straight-line ETA so endpoint stays usable
    try {
      const fromLatN = Number(req.query.fromLat);
      const fromLngN = Number(req.query.fromLng);
      const toLatN = Number(req.query.toLat);
      const toLngN = Number(req.query.toLng);

      const distKm = haversineKm(fromLatN, fromLngN, toLatN, toLngN);
      const avgSpeedKmph = 40; // fallback speed
      const etaMinutes = Math.max(1, Math.round((distKm / avgSpeedKmph) * 60));

      return res.json({
        etaMinutes,
        distanceKm: distKm.toFixed(2),
        mode: "fallback",
        note: "Approximate ETA (haversine) used due to routing API error",
      });
    } catch (fallbackErr) {
      console.error("ETA fallback error:", fallbackErr);
      return res.status(500).json({ error: "Failed to calculate ETA" });
    }
  }
};
