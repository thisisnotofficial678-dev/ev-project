import { ChargingStation, Booking, LoadData, Notification, AnalyticsData } from '../types';

export const mockStations: ChargingStation[] = [
  {
    id: '1',
    name: 'MG Road Charging Hub',
    location: 'MG Road, Bangalore, Karnataka',
    totalSlots: 12,
    availableSlots: 4,
    currentLoad: 145.5,
    maxCapacity: 180,
    status: 'active',
    pricePerKwh: 18.50
  },
  {
    id: '2',
    name: 'Mysore Palace Station',
    location: 'Palace Road, Mysore, Karnataka',
    totalSlots: 8,
    availableSlots: 2,
    currentLoad: 98.3,
    maxCapacity: 120,
    status: 'active',
    pricePerKwh: 16.75
  },
  {
    id: '3',
    name: 'Kempegowda Airport Express',
    location: 'Airport Road, Bangalore, Karnataka',
    totalSlots: 16,
    availableSlots: 3,
    currentLoad: 185.7,
    maxCapacity: 240,
    status: 'active',
    pricePerKwh: 22.00
  },
  {
    id: '4',
    name: 'Mangalore Port Hub',
    location: 'Port Area, Mangalore, Karnataka',
    totalSlots: 6,
    availableSlots: 1,
    currentLoad: 145.2,
    maxCapacity: 150,
    status: 'maintenance',
    pricePerKwh: 17.25
  },
  {
    id: '5',
    name: 'Hubli City Center',
    location: 'Station Road, Hubli, Karnataka',
    totalSlots: 10,
    availableSlots: 5,
    currentLoad: 78.9,
    maxCapacity: 140,
    status: 'active',
    pricePerKwh: 15.50
  },
  {
    id: '6',
    name: 'Manipal University Station',
    location: 'University Campus, Manipal, Karnataka',
    totalSlots: 8,
    availableSlots: 6,
    currentLoad: 45.2,
    maxCapacity: 100,
    status: 'active',
    pricePerKwh: 14.00
  },
  {
    id: '7',
    name: 'Udupi Temple Complex',
    location: 'Temple Street, Udupi, Karnataka',
    totalSlots: 6,
    availableSlots: 2,
    currentLoad: 67.8,
    maxCapacity: 90,
    status: 'active',
    pricePerKwh: 16.00
  },
  {
    id: '8',
    name: 'Belgaum Fort Station',
    location: 'Fort Area, Belgaum, Karnataka',
    totalSlots: 4,
    availableSlots: 0,
    currentLoad: 85.4,
    maxCapacity: 80,
    status: 'active',
    pricePerKwh: 15.75
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Rahul Sharma',
    userEmail: 'rahul@example.com',
    stationId: '1',
    stationName: 'MG Road Charging Hub',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T11:00:00Z',
    status: 'active',
    energyConsumed: 25.5,
    cost: 471.75,
    slotNumber: 3
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Priya Patel',
    userEmail: 'priya@example.com',
    stationId: '2',
    stationName: 'Mysore Palace Station',
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T13:30:00Z',
    status: 'pending',
    energyConsumed: 0,
    cost: 0,
    slotNumber: 5
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Arjun Kumar',
    userEmail: 'arjun@example.com',
    stationId: '3',
    stationName: 'Kempegowda Airport Express',
    startTime: '2024-01-14T14:00:00Z',
    endTime: '2024-01-14T16:30:00Z',
    status: 'completed',
    energyConsumed: 42.3,
    cost: 930.60,
    slotNumber: 8
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Anjali Reddy',
    userEmail: 'anjali@example.com',
    stationId: '5',
    stationName: 'Hubli City Center',
    startTime: '2024-01-15T08:00:00Z',
    endTime: '2024-01-15T10:00:00Z',
    status: 'completed',
    energyConsumed: 18.7,
    cost: 289.85,
    slotNumber: 2
  },
  {
    id: '5',
    userId: 'u5',
    userName: 'Vikram Singh',
    userEmail: 'vikram@example.com',
    stationId: '6',
    stationName: 'Manipal University Station',
    startTime: '2024-01-15T12:00:00Z',
    endTime: '2024-01-15T14:30:00Z',
    status: 'active',
    energyConsumed: 15.2,
    cost: 212.80,
    slotNumber: 4
  }
];

export const generateLoadData = (): LoadData[] => {
  const data: LoadData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    mockStations.forEach(station => {
      data.push({
        timestamp: timestamp.toISOString(),
        load: Math.random() * station.maxCapacity * 0.8 + station.maxCapacity * 0.1,
        stationId: station.id
      });
    });
  }
  
  return data;
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Station Overload Alert',
    message: 'Kempegowda Airport Express station is running at 95% capacity',
    type: 'warning',
    timestamp: '2024-01-15T10:30:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Maintenance Complete',
    message: 'Mangalore Port Hub maintenance completed successfully',
    type: 'success',
    timestamp: '2024-01-15T09:15:00Z',
    read: true
  },
  {
    id: '3',
    title: 'New Booking Request',
    message: 'Urgent booking request for MG Road Charging Hub',
    type: 'info',
    timestamp: '2024-01-15T11:45:00Z',
    read: false
  },
  {
    id: '4',
    title: 'Revenue Milestone',
    message: 'Daily revenue crossed ₹50,000 mark',
    type: 'success',
    timestamp: '2024-01-15T12:00:00Z',
    read: false
  }
];

export const mockAnalytics: AnalyticsData = {
  totalRevenue: 1250000.50,
  totalBookings: 847,
  totalEnergyConsumed: 12450.8,
  peakUsageHours: [
    { hour: 8, usage: 85 },
    { hour: 9, usage: 92 },
    { hour: 17, usage: 88 },
    { hour: 18, usage: 95 },
    { hour: 19, usage: 78 }
  ],
  stationUsage: [
    { stationId: '1', bookings: 245 },
    { stationId: '2', bookings: 312 },
    { stationId: '3', bookings: 198 },
    { stationId: '4', bookings: 92 },
    { stationId: '5', bookings: 156 },
    { stationId: '6', bookings: 134 },
    { stationId: '7', bookings: 89 },
    { stationId: '8', bookings: 67 }
  ],
  revenueByDay: [
    { date: '2024-01-08', revenue: 45000 },
    { date: '2024-01-09', revenue: 52000 },
    { date: '2024-01-10', revenue: 48000 },
    { date: '2024-01-11', revenue: 55000 },
    { date: '2024-01-12', revenue: 62000 },
    { date: '2024-01-13', revenue: 58000 },
    { date: '2024-01-14', revenue: 65000 }
  ]
};