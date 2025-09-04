import { useEffect, useState } from "react";
import { useIntroForm } from "../context/IntroFormContext";

const Navbar: React.FC = () => {
  const { resetIntroForm } = useIntroForm();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("evslot:theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(initialDark);
    const root = document.documentElement;
    if (initialDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("evslot:theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("evslot:theme", "light");
    }
  }, [isDark]);

  return (
    <nav className="w-full bg-green-400 dark:bg-gray-900 shadow-md px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src="https://theppeonlineshop.co.uk/images/zoomimages/9700-1000.jpg"
          alt="EV Logo"
          className="w-10 h-10 rounded-lg object-cover border border-black/10 dark:border-white/20"
        />
        <span className="hidden md:inline text-black dark:text-white font-semibold">EV Slot</span>
      </div>

      {/* Links */}
      <ul className="flex space-x-6 text-black dark:text-gray-100 font-semibold">
        <li><a href="#hero">Home</a></li>
        <li><a href="#stations">Stations</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li className="relative group">
          <a href="#about">About</a>
          <div className="absolute left-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-md min-w-56 p-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="font-semibold mb-1">EV Slot</div>
            <div className="mb-2">Find and book EV charging slots easily.</div>
            <div className="grid grid-cols-2 gap-2">
              <a className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10" href="#features">Features</a>
              <a className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10" href="#stations">Map</a>
              <a className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10" href="#pricing">Pricing</a>
              <a className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg:white/10" href="/login">Careers (Login)</a>
            </div>
          </div>
        </li>
        <li className="relative group">
          <a href="#contact">Contact</a>
          <div className="absolute left-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg shadow-md min-w-56 p-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="mb-1"><span className="font-semibold">Email:</span> support@evslot.example</div>
            <div className="mb-1"><span className="font-semibold">Phone:</span> +91 98765 43210</div>
            <div><span className="font-semibold">Address:</span> Bengaluru, IN</div>
          </div>
        </li>
      </ul>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button
          aria-label="Toggle dark mode"
          onClick={() => setIsDark((v) => !v)}
          className="h-10 w-10 rounded-lg border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.752 15.002A9.718 9.718 0 0 1 12.002 22C6.478 22 2 17.523 2 12a9.998 9.998 0 0 1 11.002-9.95 0.75 0.75 0 0 1 .21 1.42 6.998 6.998 0 0 0 8.12 10.532 0.75 0.75 0 0 1 .42 1.001Z"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm6.364 2.386a.75.75 0 0 1 1.06 1.06l-1.06 1.061a.75.75 0 1 1-1.06-1.06l1.06-1.061ZM21.75 12a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75Zm-3.386 6.364a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 0 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.061ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM6.386 18.364a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 1 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.061ZM4.5 12a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5H3.75A.75.75 0 0 1 4.5 12Zm1.636-6.364a.75.75 0 0 1 0 1.06L5.075 7.758a.75.75 0 1 1-1.06-1.06l1.06-1.061a.75.75 0 0 1 1.06 0Z"/></svg>
          )}
        </button>
        <button
          onClick={resetIntroForm}
          className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 text-sm"
          title="Reset intro form (for testing)"
        >
          Reset
        </button>
        <a className="px-4 py-2 rounded-lg border border-black/10 text-black hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10" href="/login">Login</a>
        <a className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800" href="/signup">Sign Up</a>
      </div>
    </nav>
  );
};

export default Navbar;
