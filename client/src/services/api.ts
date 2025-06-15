import axios from 'axios';
import type { ApiResponse, User } from '../types';

// Use the current window location to determine the API URL
const API_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_API_URL : 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    // Log the full error for debugging, including response data if available
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message, // Include generic message
      config: error.config,
    });
    return Promise.reject(error);
  }
);

// This interface reflects the direct JSON response from the server for login/register
export interface AuthResponseFromServer {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponseFromServer>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post<AuthResponseFromServer>('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<any>>('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/profile');
      console.log('AuthService.getCurrentUser: Received response:', response.data);
      if (!response.data.success || !response.data.user) {
        console.error('AuthService.getCurrentUser: Invalid response data or success false:', response.data);
        throw new Error(response.data.message || 'Failed to get profile: Invalid response');
      }
      return response.data.user;
    } catch (error: any) {
      console.error('AuthService.getCurrentUser: Error during fetch:', error.response?.data || error.message);
      throw error; // Re-throw to be caught by createAsyncThunk
    }
  },

  updateProfile: async (formData: FormData) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadProfilePicture: async (formData: FormData) => {
    const response = await api.post<ApiResponse<{ profilePicture: string }>>('/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export const classes = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<any>>('/classes', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/classes/${id}`);
    return response.data;
  },

  create: async (classData: any) => {
    const response = await api.post<ApiResponse<any>>('/classes', classData);
    return response.data;
  },

  update: async (id: string, classData: any) => {
    const response = await api.put<ApiResponse<any>>(`/classes/${id}`, classData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<any>>(`/classes/${id}`);
    return response.data;
  },

  enroll: async (id: string) => {
    const response = await api.post<ApiResponse<any>>(`/classes/${id}/enroll`);
    return response.data;
  },

  unenroll: async (id: string) => {
    const response = await api.post<ApiResponse<any>>(`/classes/${id}/unenroll`);
    return response.data;
  },
};

export const payments = {
  createRazorpayOrder: async (classId: string) => {
    const response = await api.post<ApiResponse<any>>('/payments/create-order', {
      classId,
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get<ApiResponse<any>>('/payments/history');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/payments/${id}`);
    return response.data;
  },
};

export default {
  auth,
  classes,
  payments,
}; 