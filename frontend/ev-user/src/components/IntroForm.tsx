import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  vehicleType: string;
  evModel: string;
  city: string;
}

interface IntroFormProps {
  onComplete: (data: FormData) => void;
}

const IntroForm: React.FC<IntroFormProps> = ({ onComplete }) => {
  const Estimator: React.FC = () => {
    const [batteryCapacityKWh, setBatteryCapacityKWh] = useState<number | "">("");
    const [speedType, setSpeedType] = useState<"ac" | "dc">("ac");
    const [currentSoc, setCurrentSoc] = useState<number>(20);
    const [targetSoc, setTargetSoc] = useState<number>(80);

    const chargePowerKw = useMemo(() => (speedType === "dc" ? 50 : 7.2), [speedType]);

    const estimatedHours = useMemo(() => {
      if (batteryCapacityKWh === "") return "";
      const start = Math.max(0, Math.min(100, currentSoc));
      const end = Math.max(0, Math.min(100, targetSoc));
      const deltaPercent = Math.max(0, end - start);
      const energyKWhNeeded = (Number(batteryCapacityKWh) * deltaPercent) / 100;
      if (chargePowerKw <= 0) return "";
      const hours = energyKWhNeeded / chargePowerKw;
      if (!isFinite(hours) || hours < 0) return "";
      return Math.round(hours * 10) / 10;
    }, [batteryCapacityKWh, currentSoc, targetSoc, chargePowerKw]);

    return (
      <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form className="grid grid-cols-1 gap-3">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Battery Capacity (kWh)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              placeholder="e.g., 60"
              value={batteryCapacityKWh === "" ? "" : batteryCapacityKWh}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") { setBatteryCapacityKWh(""); return; }
                setBatteryCapacityKWh(Number(v));
              }}
              className={`h-11 rounded-lg px-3 border focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Preferred Charging Speed</label>
            <select
              value={speedType}
              onChange={(e) => setSpeedType(e.target.value as "ac" | "dc")}
              className="h-9 rounded-md px-2 text-sm border bg-white border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ac">Normal (AC)</option>
              <option value="dc">Fast (DC)</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Current Battery %</label>
            <input
              type="range"
              min="0"
              max="100"
              value={currentSoc}
              onChange={(e) => setCurrentSoc(Number(e.target.value))}
              className="w-full"
            />
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentSoc}%</div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Target Battery %</label>
            <input
              type="range"
              min="0"
              max="100"
              value={targetSoc}
              onChange={(e) => setTargetSoc(Number(e.target.value))}
              className="w-full"
            />
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{targetSoc}%</div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Charging Duration (hours)</label>
            <input
              type="text"
              readOnly
              value={estimatedHours === "" ? "" : `${estimatedHours} h`}
              placeholder="Auto-calculated"
              className={`h-11 rounded-lg px-3 border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
            />
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Power assumed: {chargePowerKw} kW</div>
        </form>
      </div>
    );
  };
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    evModel: '',
    city: ''
  });

  useEffect(() => {
    // Check for existing form data in localStorage
    const savedData = localStorage.getItem('introFormData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    // Show panel immediately
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('introFormData', JSON.stringify(formData));
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Call the completion callback
    onComplete(formData);
    
    // Navigate to landing page
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background - match landing page (Hero) */}
      <div className="absolute inset-0">
        <img
          src="https://www.evmechanica.com/wp-content/uploads/2024/10/TOP-10-Leading-EV-Charging-Station-Companies-in-India.jpg"
          alt="EV charging background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>
      
      {/* Dark Mode Toggle */}
      <button
        onClick={() => {
          toggleDarkMode();
          localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
        }}
        className={`absolute top-6 left-6 p-3 rounded-full transition-all duration-300 z-10 ${
          isDarkMode 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Welcome Text - right side */}
      <div className="absolute inset-0 flex items-center justify-end pr-6">
        <div className="w-auto text-right text-white z-10">
          <h1 className="text-6xl font-bold drop-shadow-lg">EV SLOT BOOKING</h1>
        </div>
      </div>

      {/* Form Container - Left narrow panel */}
      <div className={`absolute left-0 top-0 h-full w-full max-w-md transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="h-full p-4 md:p-6 flex items-center justify-center bg-green-500/40 backdrop-blur-sm">
          <div className="w-full p-5 rounded-2xl shadow-2xl transition-all duration-500 overflow-y-auto max-h-[72vh] bg-purple-200 text-purple-900 border border-purple-300">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 text-purple-900">
                Let's Get Started
              </h2>
              <p className="text-sm text-purple-700">
                Tell us about yourself
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Vehicle Type *
                </label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  required
                  className="w-full h-9 px-2 text-sm rounded-md border bg-white border-gray-300 text-gray-900 shadow-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select vehicle type</option>
                  <option value="2-wheeler">2-wheeler</option>
                  <option value="4-wheeler">4-wheeler</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* EV Model */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  EV Model
                </label>
                <input
                  type="text"
                  name="evModel"
                  value={formData.evModel}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your EV model (optional)"
                />
              </div>

              {/* City */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your city"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:from-green-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 mt-6"
              >
                Get Started
              </button>
            </form>

                         {/* Skip Option */}
             <div className="text-center mt-4">
               <button
                 onClick={() => {
                   localStorage.setItem('introFormData', JSON.stringify(formData));
                   localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
                   onComplete(formData);
                   navigate('/');
                 }}
                 className={`text-sm underline transition-colors duration-300 ${
                   isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                 }`}
               >
                 Skip for now
               </button>
             </div>
             
             {/* Charging Estimator */}
             <div className="mt-8 pt-6 border-t border-green-200">
               <h3 className="text-lg font-semibold mb-4 text-center">Charging Estimator</h3>
               <Estimator />
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

export default IntroForm;
