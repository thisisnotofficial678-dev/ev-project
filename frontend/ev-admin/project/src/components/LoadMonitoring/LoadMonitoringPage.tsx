import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { mockStations, generateLoadData } from '../../data/mockData';
import { OverviewCard } from '../Cards/OverviewCard';

export function LoadMonitoringPage() {
  const [loadData, setLoadData] = useState(generateLoadData());
  const [selectedStation, setSelectedStation] = useState<string>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadData(generateLoadData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const totalLoad = mockStations.reduce((acc, station) => acc + station.currentLoad, 0);
  const totalCapacity = mockStations.reduce((acc, station) => acc + station.maxCapacity, 0);
  const loadPercentage = Math.round((totalLoad / totalCapacity) * 100);

  const filteredData = selectedStation === 'all' 
    ? loadData.reduce((acc, curr) => {
        const existing = acc.find(item => item.timestamp === curr.timestamp);
        if (existing) {
          existing.load += curr.load;
        } else {
          acc.push({ timestamp: curr.timestamp, load: curr.load });
        }
        return acc;
      }, [] as typeof loadData)
    : loadData.filter(item => item.stationId === selectedStation);

  const chartData = filteredData.slice(-24).map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    load: Math.round(item.load)
  }));

  const peakLoad = Math.max(...chartData.map(d => d.load));
  const avgLoad = Math.round(chartData.reduce((acc, d) => acc + d.load, 0) / chartData.length);

  const aiPredictions = [
    "Load expected to increase by 15% in next hour (5-6 PM)",
    "Recommend redistributing 25kW from Airport Express to Mall Hub",
    "Station Downtown A approaching capacity - suggest temporary price increase"
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewCard
          title="Current Total Load"
          value={`${totalLoad.toFixed(1)} kW`}
          change={`${loadPercentage}% of capacity`}
          icon={Zap}
          color="blue"
        />
        <OverviewCard
          title="Peak Load (24h)"
          value={`${peakLoad} kW`}
          change="3:30 PM today"
          icon={TrendingUp}
          color="green"
        />
        <OverviewCard
          title="Average Load (24h)"
          value={`${avgLoad} kW`}
          change="+5% vs yesterday"
          changeType="positive"
          icon={Activity}
          color="purple"
        />
        <OverviewCard
          title="Load Alerts"
          value="2"
          change="High load warnings"
          icon={AlertTriangle}
          color="yellow"
        />
      </div>

      {/* Station Selector and Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Real-Time Load Monitoring</h3>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stations</option>
            {mockStations.map(station => (
              <option key={station.id} value={station.id}>{station.name}</option>
            ))}
          </select>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Station Load Distribution and AI Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Load Distribution</h3>
          <div className="space-y-4">
            {mockStations.map(station => {
              const loadPercent = Math.round((station.currentLoad / station.maxCapacity) * 100);
              return (
                <div key={station.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{station.name}</span>
                    <span className="text-sm text-gray-500">
                      {station.currentLoad.toFixed(1)}kW / {station.maxCapacity}kW
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        loadPercent > 90 ? 'bg-red-500' : 
                        loadPercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Load Predictions</h3>
          <div className="space-y-4">
            {aiPredictions.map((prediction, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-white font-semibold">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700">{prediction}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
            <h4 className="font-semibold mb-2">Next Hour Forecast</h4>
            <div className="text-2xl font-bold">{Math.round(totalLoad * 1.15)} kW</div>
            <p className="text-sm opacity-90">+15% increase expected</p>
          </div>
        </div>
      </div>
    </div>
  );
}