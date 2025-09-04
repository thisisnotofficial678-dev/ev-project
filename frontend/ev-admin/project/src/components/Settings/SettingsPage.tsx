import React, { useState } from 'react';
import { Save, Plus, Edit2, Trash2, MapPin, DollarSign, Settings, Bell, Shield, Zap, X } from 'lucide-react';
import { mockStations } from '../../data/mockData';
import { ChargingStation } from '../../types';

export function SettingsPage() {
  const [stations, setStations] = useState<ChargingStation[]>(mockStations);
  const [showAddStation, setShowAddStation] = useState(false);
  const [editingStation, setEditingStation] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState({
    defaultPricePerKwh: 18.50,
    maintenanceMode: false,
    autoApproveBookings: true,
    maxBookingDuration: 4,
    peakHourMultiplier: 1.5,
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      requireOtp: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  });

  const [newStation, setNewStation] = useState({
    name: '',
    location: '',
    totalSlots: 8,
    maxCapacity: 150,
    pricePerKwh: 18.50
  });

  const addStation = () => {
    const station: ChargingStation = {
      id: Date.now().toString(),
      ...newStation,
      availableSlots: newStation.totalSlots,
      currentLoad: 0,
      status: 'active'
    };
    
    setStations([...stations, station]);
    setNewStation({ name: '', location: '', totalSlots: 8, maxCapacity: 150, pricePerKwh: 18.50 });
    setShowAddStation(false);
  };

  const updateStation = (stationId: string, updates: Partial<ChargingStation>) => {
    setStations(stations.map(station =>
      station.id === stationId ? { ...station, ...updates } : station
    ));
    setEditingStation(null);
  };

  const deleteStation = (stationId: string) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      setStations(stations.filter(station => station.id !== stationId));
    }
  };

  const saveGlobalSettings = () => {
    // In a real app, this would save to backend
    alert('Global settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Global Settings */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-cyan-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400">Global Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white border-b border-cyan-500/20 pb-2">Pricing Configuration</h4>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Default Price per kWh (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={globalSettings.defaultPricePerKwh}
                onChange={(e) => setGlobalSettings({ ...globalSettings, defaultPricePerKwh: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Peak Hour Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                value={globalSettings.peakHourMultiplier}
                onChange={(e) => setGlobalSettings({ ...globalSettings, peakHourMultiplier: parseFloat(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Max Booking Duration (hours)
              </label>
              <input
                type="number"
                value={globalSettings.maxBookingDuration}
                onChange={(e) => setGlobalSettings({ ...globalSettings, maxBookingDuration: parseInt(e.target.value) })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              />
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white border-b border-cyan-500/20 pb-2">System Configuration</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={globalSettings.maintenanceMode}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, maintenanceMode: e.target.checked })}
                  className="rounded border-gray-600 text-cyan-500 bg-gray-700 focus:ring-cyan-500"
                />
                <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-300">
                  Maintenance Mode
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={globalSettings.autoApproveBookings}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, autoApproveBookings: e.target.checked })}
                  className="rounded border-gray-600 text-cyan-500 bg-gray-700 focus:ring-cyan-500"
                />
                <label htmlFor="autoApprove" className="ml-2 text-sm text-gray-300">
                  Auto-approve Bookings
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">
                Timezone
              </label>
              <select
                value={globalSettings.timezone}
                onChange={(e) => setGlobalSettings({ ...globalSettings, timezone: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={saveGlobalSettings}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Settings</span>
          </button>
        </div>
      </div>

      {/* Station Management */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-cyan-500/20">
        <div className="p-6 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-400">Station Management</h3>
            </div>
            <button
              onClick={() => setShowAddStation(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Station</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-cyan-500/20">
          {stations.map((station) => (
            <div key={station.id} className="p-6">
              {editingStation === station.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        Station Name
                      </label>
                      <input
                        type="text"
                        value={station.name}
                        onChange={(e) => updateStation(station.id, { name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={station.location}
                        onChange={(e) => updateStation(station.id, { location: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        Total Slots
                      </label>
                      <input
                        type="number"
                        value={station.totalSlots}
                        onChange={(e) => updateStation(station.id, { totalSlots: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        Max Capacity (kW)
                      </label>
                      <input
                        type="number"
                        value={station.maxCapacity}
                        onChange={(e) => updateStation(station.id, { maxCapacity: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        Price per kWh (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={station.pricePerKwh}
                        onChange={(e) => updateStation(station.id, { pricePerKwh: parseFloat(e.target.value) })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingStation(null)}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingStation(null)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white">{station.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-cyan-400" />
                          {station.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 text-cyan-400" />
                          ₹{station.pricePerKwh}/kWh
                        </div>
                        <span>{station.totalSlots} slots</span>
                        <span>{station.maxCapacity}kW capacity</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingStation(station.id)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-2 hover:bg-cyan-500/10 rounded"
                      title="Edit Station"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteStation(station.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded"
                      title="Delete Station"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Station Modal */}
      {showAddStation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-400">Add New Station</h3>
              <button 
                onClick={() => setShowAddStation(false)}
                className="text-gray-400 hover:text-cyan-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); addStation(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cyan-300 mb-1">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={newStation.name}
                    onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cyan-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newStation.location}
                    onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">
                    Total Slots
                  </label>
                  <input
                    type="number"
                    value={newStation.totalSlots}
                    onChange={(e) => setNewStation({ ...newStation, totalSlots: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-1">
                    Max Capacity (kW)
                  </label>
                  <input
                    type="number"
                    value={newStation.maxCapacity}
                    onChange={(e) => setNewStation({ ...newStation, maxCapacity: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cyan-300 mb-1">
                    Price per kWh (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStation.pricePerKwh}
                    onChange={(e) => setNewStation({ ...newStation, pricePerKwh: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStation(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Add Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}