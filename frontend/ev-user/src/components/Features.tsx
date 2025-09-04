const features = [
  { title: "Smart Slot Recommendation", desc: "We suggest optimal stations and times automatically." },
  { title: "Real-time Monitoring", desc: "Track live charger status and slot occupancy." },
  { title: "Fast Booking", desc: "Reserve a slot in seconds with one tap." },
  { title: "Load Balanced Charging", desc: "Even distribution across chargers for minimal wait." },
];

const Features: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;


