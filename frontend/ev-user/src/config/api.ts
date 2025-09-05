// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to production backend
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://ev-project-aymy.onrender.com',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // User Management
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    
    // Stations
    STATIONS: '/stations',
    STATION_DETAILS: '/stations/:id',
    SEARCH_STATIONS: '/stations/search',
    
    // Bookings
    BOOKINGS: '/bookings',
    CREATE_BOOKING: '/bookings',
    BOOKING_DETAILS: '/bookings/:id',
    CANCEL_BOOKING: '/bookings/:id/cancel',
    
    // Payments
    CREATE_ORDER: '/payments/create-order',
    VERIFY_PAYMENT: '/payments/verify',
    
    // Notifications
    NOTIFICATIONS: '/notifications',
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
  const token = localStorage.getItem('evslot:token');
  
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
