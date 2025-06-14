import { api } from './api';
import type { ApiResponse, User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const { token, user } = response.data.data!;
    localStorage.setItem('token', token);
    return user;
  },

  async register(data: RegisterData) {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    const { token, user } = response.data.data!;
    localStorage.setItem('token', token);
    return user;
  },

  async logout() {
    await api.post<ApiResponse<void>>('/auth/logout');
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  async forgotPassword(email: string) {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, password: string) {
    const response = await api.post<ApiResponse<void>>('/auth/reset-password', {
      token,
      password,
    });
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
}; 