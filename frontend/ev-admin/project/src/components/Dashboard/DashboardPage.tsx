import React from 'react';
import { Zap, Calendar, Activity, TrendingUp } from 'lucide-react';
import { OverviewCard } from '../Cards/OverviewCard';
import { mockStations, mockBookings } from '../../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const recentActivityData = [
  { time: '00:00', load: 45 },
  { time: '04:00', load: 35 },
  { time: '08:00', load: 85 },
  { time: '12:00', load: 75 },
  { time: '16:00', load: 95 },
  { time: '20:00', load: 65 },
  { time: '24:00', load: 55 },
];

const stationUsageData = mockStations.map(station => ({
  name: station.name.split(' ')[0],
  usage: Math.round((station.totalSlots - station.availableSlots) / station.totalSlots * 100)
}));

export function DashboardPage() {
  const totalSlots = mockStations.reduce((acc, station) => acc + station.totalSlots, 0);
  const activeBookings = mockBookings.filter(booking => booking.status === 'active').length;
  const currentLoad = mockStations.reduce((acc, station) => acc + station.currentLoad, 0);
  const energyConsumedToday = 1250.8;
  const totalRevenue = mockBookings.reduce((acc, booking) => acc + booking.cost, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Slots"
          value={totalSlots}
          change="+2 new stations"
          changeType="positive"
          icon={Zap}
          color="cyan"
        />
        <OverviewCard
          title="Active Bookings"
          value={activeBookings}
          change="+12% from yesterday"
          changeType="positive"
          icon={Calendar}
          color="purple"
        />
        <OverviewCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          change="+15% this month"
          changeType="positive"
          icon={TrendingUp}
          color="pink"
        />
        <OverviewCard
          title="Current Load"
          value={`${currentLoad.toFixed(1)} kW`}
          change="85% of capacity"
          icon={Activity}
          color="yellow"
        />
        <OverviewCard
          title="Energy Today"
          value={`${energyConsumedToday} kWh`}
          change="+8.5% vs avg"
          changeType="positive"
          icon={TrendingUp}
          color="cyan"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Load Distribution (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="load" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">Station Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stationUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="usage" fill="#A855F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-pink-500/20">
        <h3 className="text-lg font-semibold text-pink-400 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {mockBookings.slice(0, 5).map((booking, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{booking.stationName}</p>
                  <p className="text-gray-400 text-sm">{booking.userName} • {booking.duration} hours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-semibold">₹{booking.cost.toLocaleString('en-IN')}</p>
                <p className="text-gray-400 text-sm">{booking.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}