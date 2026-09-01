import { apiRequest, AUTH_TOKEN_KEY } from './api';
import { User, UserAddress } from '../types';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const user = await apiRequest<User>('/auth/me');
      return user;
    } catch (err) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
  },

  async login(email: string, passwordPlain = 'CMAdmin@2026!Secure'): Promise<{ user: User; token: string }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      data: { email, password: passwordPlain },
    });

    if (res.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    }
    return res;
  },

  async register(email: string, passwordPlain: string, fullName: string, phoneNumber?: string): Promise<{ user: User; token: string }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      data: { email, password: passwordPlain, fullName, phoneNumber },
    });

    if (res.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    }
    return res;
  },

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await apiRequest<{ user: User }>('/auth/profile', {
      method: 'PUT',
      data: updates,
    });
    return res.user || (res as any);
  },

  async addAddress(address: Omit<UserAddress, 'id'>): Promise<{ address: UserAddress; addresses: UserAddress[] }> {
    return apiRequest('/auth/addresses', {
      method: 'POST',
      data: address,
    });
  },

  async deleteAddress(addressId: string): Promise<{ addresses: UserAddress[] }> {
    return apiRequest(`/auth/addresses/${addressId}`, {
      method: 'DELETE',
    });
  },
};
