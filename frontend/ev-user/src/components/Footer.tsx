const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-green-500 text-white font-bold flex items-center justify-center">EV</div>
            <span className="font-semibold text-white">EV Slot</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className="hover:text-white" href="#">About</a>
            <a className="hover:text-white" href="#">Pricing</a>
            <a className="hover:text-white" href="#">Stations</a>
            <a className="hover:text-white" href="#">Contact</a>
          </nav>
        </div>
        <div className="mt-6 border-t border-white/10 pt-6 text-sm flex items-center justify-between">
          <p>© {new Date().getFullYear()} EV Slot. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-white" href="#">Terms</a>
            <a className="hover:text-white" href="#">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


