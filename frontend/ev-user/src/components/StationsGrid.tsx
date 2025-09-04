type Station = {
  id: string;
  name: string;
  distanceKm: number;
  pricePerKwh: number;
  connectors: string[];
  imageUrl: string;
  availability: string;
};

const sampleStations: Station[] = [
  {
    id: "1",
    name: "GreenCharge - Downtown",
    distanceKm: 1.2,
    pricePerKwh: 0.22,
    connectors: ["CCS", "Type 2"],
    imageUrl: "https://images.unsplash.com/photo-1593941707874-ef25b8b6361d",
    availability: "4/8 slots",
  },
  {
    id: "2",
    name: "VoltHub - Riverside",
    distanceKm: 3.8,
    pricePerKwh: 0.28,
    connectors: ["CCS", "CHAdeMO"],
    imageUrl: "https://images.unsplash.com/photo-1601924629461-d475b9b38d9f",
    availability: "2/6 slots",
  },
  {
    id: "3",
    name: "EcoPlug - Midtown Mall",
    distanceKm: 5.1,
    pricePerKwh: 0.25,
    connectors: ["Type 2"],
    imageUrl: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2",
    availability: "5/10 slots",
  },
];

const StationsGrid: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Nearby stations</h2>
            <p className="text-gray-600">Based on your search and location</p>
          </div>
          <button className="hidden md:inline-flex h-10 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">View all</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sampleStations.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-36 w-full bg-gray-100">
                <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
                    <p className="text-sm text-gray-600">{s.distanceKm.toFixed(1)} km away • {s.availability}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">from</div>
                    <div className="text-lg font-bold text-gray-900">${s.pricePerKwh.toFixed(2)}/kWh</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.connectors.map((c) => (
                    <span key={c} className="px-2 py-1 text-xs rounded-lg bg-green-100 text-green-700 border border-green-200">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <button className="w-full h-10 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StationsGrid;


