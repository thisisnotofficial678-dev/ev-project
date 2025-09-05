// API Configuration for Admin Dashboard
export const API_CONFIG = {
  // Use environment variable or fallback to production backend
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://ev-project-aymy.onrender.com',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    
    // Admin Analytics
    DASHBOARD_STATS: '/admin/analytics/dashboard',
    STATION_ANALYTICS: '/admin/analytics/stations',
    USER_ANALYTICS: '/admin/analytics/users',
    BOOKING_ANALYTICS: '/admin/analytics/bookings',
    REVENUE_ANALYTICS: '/admin/analytics/revenue',
    
    // Station Management
    STATIONS: '/stations',
    STATION_DETAILS: '/stations/:id',
    ADD_STATION: '/stations',
    UPDATE_STATION: '/stations/:id',
    DELETE_STATION: '/stations/:id',
    
    // User Management
    USERS: '/admin/users',
    USER_DETAILS: '/admin/users/:id',
    UPDATE_USER: '/admin/users/:id',
    DELETE_USER: '/admin/users/:id',
    
    // Booking Management
    BOOKINGS: '/admin/bookings',
    BOOKING_DETAILS: '/admin/bookings/:id',
    UPDATE_BOOKING: '/admin/bookings/:id',
    CANCEL_BOOKING: '/admin/bookings/:id/cancel',
    
    // Notifications
    NOTIFICATIONS: '/notifications',
    SEND_NOTIFICATION: '/notifications/send',
    
    // Load Monitoring
    LOAD_MONITORING: '/admin/load-monitoring',
    STATION_LOAD: '/admin/load-monitoring/:stationId',
    
    // Settings
    SYSTEM_SETTINGS: '/admin/settings',
    UPDATE_SETTINGS: '/admin/settings',
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Replace URL parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// API Request helper
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('evslot:admin:token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response;
};
