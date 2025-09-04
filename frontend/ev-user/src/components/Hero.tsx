const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[640px] flex items-center justify-center overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0">
        <img
          src="https://www.evmechanica.com/wp-content/uploads/2024/10/TOP-10-Leading-EV-Charging-Station-Companies-in-India.jpg"
          alt="EV charging background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white w-full max-w-6xl px-4 md:px-8" id="hero">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block px-5 py-4 md:px-8 md:py-6 rounded-2xl bg-black/40 backdrop-blur-sm">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3 md:mb-4">Find and Book EV Charging Slots Smartly</h1>
            <p className="text-white/95 text-base md:text-lg">
              Discover nearby stations, compare prices, and reserve a time that suits you.
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="inline-flex items-center justify-center px-6 h-11 rounded-lg bg-black/90 hover:bg-black text-white font-semibold">
            Book a Slot Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
