export interface User {
  id: string;
  email: string;
  role: 'admin' | 'sub-admin';
  name: string;
}

export interface ChargingStation {
  id: string;
  name: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
  currentLoad: number;
  maxCapacity: number;
  status: 'active' | 'disabled' | 'maintenance';
  pricePerKwh: number;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  stationId: string;
  stationName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  energyConsumed: number;
  cost: number;
  slotNumber: number;
}

export interface LoadData {
  timestamp: string;
  load: number;
  stationId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  totalEnergyConsumed: number;
  peakUsageHours: { hour: number; usage: number }[];
  stationUsage: { stationId: string; bookings: number }[];
  revenueByDay: { date: string; revenue: number }[];
}