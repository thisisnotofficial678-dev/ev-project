import React from 'react';
import { DollarSign, Calendar, Zap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { OverviewCard } from '../Cards/OverviewCard';
import { mockAnalytics, mockStations } from '../../data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function AnalyticsPage() {
  const stationNames = mockStations.reduce((acc, station) => {
    acc[station.id] = station.name;
    return acc;
  }, {} as Record<string, string>);

  const stationUsageChartData = mockAnalytics.stationUsage.map(item => ({
    name: stationNames[item.stationId]?.split(' ')[0] || `Station ${item.stationId}`,
    bookings: item.bookings
  }));

  const peakHoursData = mockAnalytics.peakUsageHours.map(item => ({
    hour: `${item.hour}:00`,
    usage: item.usage
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Revenue"
          value={`₹${mockAnalytics.totalRevenue.toLocaleString('en-IN')}`}
          change="+12.5% vs last month"
          changeType="positive"
          icon={DollarSign}
          color="green"
        />
        <OverviewCard
          title="Total Bookings"
          value={mockAnalytics.totalBookings.toLocaleString()}
          change="+8.3% vs last month"
          changeType="positive"
          icon={Calendar}
          color="blue"
        />
        <OverviewCard
          title="Energy Consumed"
          value={`${mockAnalytics.totalEnergyConsumed} kWh`}
          change="+15.2% vs last month"
          changeType="positive"
          icon={Zap}
          color="yellow"
        />
        <OverviewCard
          title="Avg Revenue/Booking"
          value={`₹${(mockAnalytics.totalRevenue / mockAnalytics.totalBookings).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change="+3.8% vs last month"
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tickFormatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stationUsageChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="bookings"
              >
                {stationUsageChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Usage Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Performance</h3>
          <div className="space-y-4">
            {mockStations.map((station, index) => {
              const usage = mockAnalytics.stationUsage.find(u => u.stationId === station.id);
              const utilizationRate = Math.round((usage?.bookings || 0) / mockAnalytics.totalBookings * 100);
              
              return (
                <div key={station.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{station.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{usage?.bookings || 0} bookings</span>
                      <span className="text-sm font-medium text-gray-700">{utilizationRate}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${COLORS[index % COLORS.length]} opacity-80`}
                      style={{ width: `${utilizationRate}%`, backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">68%</div>
            <div className="text-sm text-gray-600">Average Utilization Rate</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">2.4h</div>
            <div className="text-sm text-gray-600">Average Session Duration</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
}