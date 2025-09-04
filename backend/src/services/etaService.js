import axios from "axios";

export const getETA = async (fromLat, fromLng, toLat, toLng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&departure_time=now&traffic_model=best_guess&key=${apiKey}`;

  const response = await axios.get(url);

  if (!response.data.routes || response.data.routes.length === 0) {
    throw new Error("No route found");
  }

  const leg = response.data.routes[0].legs[0];

  return {
    etaMinutes: Math.round(leg.duration_in_traffic.value / 60),
    normalEtaMinutes: Math.round(leg.duration.value / 60),
    distanceKm: leg.distance.text,
    trafficEtaText: leg.duration_in_traffic.text,
    raw: leg,
  };
};
