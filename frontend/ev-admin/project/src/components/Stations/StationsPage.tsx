import React, { useState } from 'react';
import { Edit2, Power, MapPin, Zap, Users, Plus, X, Save, Trash2 } from 'lucide-react';
import { mockStations } from '../../data/mockData';
import { ChargingStation } from '../../types';

interface EditStationModalProps {
  station: ChargingStation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (station: ChargingStation) => void;
}

function EditStationModal({ station, isOpen, onClose, onSave }: EditStationModalProps) {
  const [formData, setFormData] = useState<ChargingStation>(station || {
    id: '',
    name: '',
    location: '',
    totalSlots: 0,
    availableSlots: 0,
    currentLoad: 0,
    maxCapacity: 0,
    status: 'active',
    pricePerKwh: 0
  });

  React.useEffect(() => {
    if (station) {
      setFormData(station);
    }
  }, [station]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-cyan-500/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-cyan-400">
            {station ? 'Edit Station' : 'Add New Station'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-cyan-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Station Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Total Slots</label>
              <input
                type="number"
                value={formData.totalSlots}
                onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Available Slots</label>
              <input
                type="number"
                value={formData.availableSlots}
                onChange={(e) => setFormData({ ...formData, availableSlots: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Current Load (kW)</label>
              <input
                type="number"
                step="0.1"
                value={formData.currentLoad}
                onChange={(e) => setFormData({ ...formData, currentLoad: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2">Max Capacity (kW)</label>
              <input
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Price per kWh (₹)</label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerKwh}
              onChange={(e) => setFormData({ ...formData, pricePerKwh: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function StationsPage() {
  const [stations, setStations] = useState<ChargingStation[]>(mockStations);
  const [editingStation, setEditingStation] = useState<ChargingStation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStationStatus = (stationId: string) => {
    setStations(stations.map(station => 
      station.id === stationId 
        ? { ...station, status: station.status === 'active' ? 'disabled' : 'active' }
        : station
    ));
  };

  const handleEditStation = (station: ChargingStation) => {
    setEditingStation(station);
    setIsModalOpen(true);
  };

  const handleAddStation = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleSaveStation = (stationData: ChargingStation) => {
    if (editingStation) {
      // Edit existing station
      setStations(stations.map(station => 
        station.id === editingStation.id ? stationData : station
      ));
    } else {
      // Add new station
      const newStation = {
        ...stationData,
        id: (stations.length + 1).toString()
      };
      setStations([...stations, newStation]);
    }
  };

  const handleDeleteStation = (stationId: string) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      setStations(stations.filter(station => station.id !== stationId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-cyan-900/30 text-cyan-400 border-cyan-500/30';
      case 'disabled': return 'bg-red-900/30 text-red-400 border-red-500/30';
      case 'maintenance': return 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-900/30 text-gray-400 border-gray-500/30';
    }
  };

  const getLoadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 90) return 'text-red-400';
    if (percentage > 70) return 'text-yellow-400';
    return 'text-cyan-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gray-800 rounded-xl shadow-lg border border-cyan-500/20">
        <div className="p-6 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-cyan-400">Charging Stations</h3>
            <button 
              onClick={handleAddStation}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Station</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Slots
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Current Load
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-cyan-500/20">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {station.name}
                        </div>
                        <div className="text-sm text-cyan-400">
                          ₹{station.pricePerKwh}/kWh
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="w-4 h-4 mr-1 text-cyan-400" />
                      {station.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="text-sm text-white">
                        {station.availableSlots}/{station.totalSlots}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {station.totalSlots - station.availableSlots} in use
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getLoadColor(station.currentLoad, station.maxCapacity)}`}>
                      {station.currentLoad.toFixed(1)} kW
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round((station.currentLoad / station.maxCapacity) * 100)}% of {station.maxCapacity} kW
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize border ${getStatusColor(station.status)}`}>
                      {station.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      onClick={() => handleEditStation(station)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors p-1 hover:bg-cyan-500/10 rounded"
                      title="Edit Station"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleStationStatus(station.id)}
                      className={`transition-colors p-1 rounded ${
                        station.status === 'active' 
                          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' 
                          : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                      }`}
                      title={station.status === 'active' ? 'Disable Station' : 'Enable Station'}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteStation(station.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/10 rounded"
                      title="Delete Station"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditStationModal
        station={editingStation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStation}
      />
    </div>
  );
}