import axios from "axios";

export const getETAController = async (req, res) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    // 🚦 Use drive mode with traffic enabled
    const url = `https://api.geoapify.com/v1/routing?waypoints=${fromLat},${fromLng}|${toLat},${toLng}&mode=drive,traffic:enabled&apiKey=${apiKey}`;

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
      mode: "drive with traffic",
      raw: route.properties,
    });
  } catch (error) {
    console.error("ETA API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to calculate ETA with traffic" });
  }
};
