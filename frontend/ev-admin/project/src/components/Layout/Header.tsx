import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeTitles: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/stations': 'Charging Stations',
  '/load-monitoring': 'Live Load Status',
  '/bookings': 'Bookings',
  '/analytics': 'Analytics',
  '/notifications': 'Notifications',
  '/settings': 'Settings'
};

export function Header() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <header className="bg-black border-b border-cyan-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-cyan-400">{title}</h2>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-cyan-400 transition-colors hover:bg-gray-900/50 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>
    </header>
  );
}