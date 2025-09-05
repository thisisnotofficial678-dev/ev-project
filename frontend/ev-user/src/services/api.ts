import { API_CONFIG, buildApiUrl, apiRequest } from '../config/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vehicleType?: string;
  evModel?: string;
  city?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  password: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  connectors: string[];
  availableSlots: number;
  totalSlots: number;
  pricePerHour: number;
  rating: number;
}

export interface BookingRequest {
  stationId: string;
  date: string;
  time: string;
  duration: number;
  vehicleType: string;
}

export interface Booking {
  id: string;
  stationId: string;
  stationName: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

// Authentication API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<{ user: User; token: string }> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData: RegisterRequest): Promise<{ user: User; token: string }> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD), {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};

// User API
export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.PROFILE));
    return response.json();
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROFILE), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

// Stations API
export const stationsAPI = {
  getAll: async (): Promise<Station[]> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.STATIONS));
    return response.json();
  },

  getById: async (id: string): Promise<Station> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.STATION_DETAILS, { id }));
    return response.json();
  },

  search: async (query: {
    location?: string;
    date?: string;
    time?: string;
    connector?: string;
  }): Promise<Station[]> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.SEARCH_STATIONS)}?${params}`;
    const response = await apiRequest(url);
    return response.json();
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async (): Promise<Booking[]> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.BOOKINGS));
    return response.json();
  },

  create: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_BOOKING), {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.BOOKING_DETAILS, { id }));
    return response.json();
  },

  cancel: async (id: string): Promise<{ message: string }> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.CANCEL_BOOKING, { id }), {
      method: 'POST',
    });
    return response.json();
  },
};

// Payments API
export const paymentsAPI = {
  createOrder: async (amount: number, bookingId: string): Promise<PaymentOrder> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_ORDER), {
      method: 'POST',
      body: JSON.stringify({ amount, bookingId }),
    });
    return response.json();
  },

  verifyPayment: async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    bookingId: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await apiRequest(buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_PAYMENT), {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },
};
