import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type StationMarker = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  chargers: number;
  pricingType: 'per_kwh' | 'per_min';
  price: number; // INR
  etaMinutes: number;
};

const MapInteractions: React.FC<{ onAdd: (lat: number, lng: number) => void }> = ({ onAdd }) => {
  useMapEvents({
    click(e) {
      onAdd(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapSection: React.FC = () => {
  const [preview, setPreview] = useState(true);
  const [markers, setMarkers] = useState<StationMarker[]>([]);

  // Seed with a couple of markers
  useEffect(() => {
    setMarkers([
      {
        id: "1",
        lat: 12.9716,
        lng: 77.5946,
        name: "MG Road Fast Charge",
        address: "MG Road, Bengaluru, KA 560001",
        chargers: 6,
        pricingType: 'per_kwh',
        price: 18.5,
        etaMinutes: 5,
      },
      {
        id: "2",
        lat: 12.9352,
        lng: 77.6245,
        name: "Koramangala AC Hub",
        address: "80 Feet Rd, Koramangala, Bengaluru, KA 560034",
        chargers: 10,
        pricingType: 'per_min',
        price: 3.0,
        etaMinutes: 12,
      },
    ]);
  }, []);

  const handleAdd = (lat: number, lng: number) => {
    const id = Math.random().toString(36).slice(2);
    setMarkers((m) => [
      ...m,
      {
        id,
        lat,
        lng,
        name: "New Spot",
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        chargers: 2,
        pricingType: 'per_kwh',
        price: 15,
        etaMinutes: 8,
      },
    ]);
  };

  return (
    <section id="stations" className="w-full py-12 md:py-16 bg-white/70 relative z-10">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Charging Stations</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Preview</span>
            <button
              onClick={() => setPreview((v) => !v)}
              className="h-8 px-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
            >
              {preview ? "Open interactive" : "Show preview"}
            </button>
          </div>
        </div>

        {/* Station List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Stations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markers.map((station) => (
              <div key={station.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-lg">{station.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    station.etaMinutes <= 5 ? 'bg-green-100 text-green-800' : 
                    station.etaMinutes <= 10 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {station.etaMinutes} min
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{station.address}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Chargers</div>
                    <div className="font-semibold text-gray-900">{station.chargers}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Price</div>
                    <div className="font-semibold text-gray-900">
                      ₹{station.price}
                      <span className="text-xs text-gray-500 ml-1">
                        {station.pricingType === 'per_kwh' ? '/kWh' : '/min'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {station.pricingType === 'per_kwh' ? 'Per kWh' : 'Per Minute'}
                  </span>
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {preview ? (
          <div className="h-64 w-full rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-200 flex items-center justify-center text-gray-700 relative z-10">
            Click "Open interactive" to view live map and add markers.
          </div>
        ) : (
          <div className="h-[480px] w-full overflow-hidden rounded-xl border border-gray-200 relative z-20">
            <MapContainer center={[12.9716, 77.5946]} zoom={12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapInteractions onAdd={handleAdd} />

              {markers.map((m) => (
                <Marker key={m.id} position={[m.lat, m.lng]} icon={defaultIcon}>
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">{m.name}</div>
                      <div className="text-gray-700 mb-2">{m.address}</div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="rounded-md bg-gray-50 border border-gray-200 p-2">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">Chargers</div>
                          <div className="font-semibold text-gray-900">{m.chargers}</div>
                        </div>
                        <div className="rounded-md bg-gray-50 border border-gray-200 p-2">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">ETA</div>
                          <div className="font-semibold text-gray-900">{m.etaMinutes} min</div>
                        </div>
                        <div className="col-span-2 rounded-md bg-gray-50 border border-gray-200 p-2">
                          <div className="text-[11px] uppercase tracking-wide text-gray-500">Pricing</div>
                          <div className="font-semibold text-gray-900">
                            ₹{m.price} {m.pricingType === 'per_kwh' ? '/kWh' : '/min'}
                          </div>
                        </div>
                      </div>
                      <button className="w-full px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                        Book Slot
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default MapSection;


