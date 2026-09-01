import { apiRequest } from './api';

export interface StoreSettings {
  storeName: string;
  hotline: string;
  email: string;
  address: string;
  supportHours: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankBin: string;
  standardShippingFee: number;
  expressShippingFee: number;
  freeShippingThreshold: number;
  isDemoData: boolean;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockCount: number;
  lowStockProducts: any[];
  recentOrders: any[];
}

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    return apiRequest<StoreSettings>('/settings');
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    return apiRequest<StoreSettings>('/settings', {
      method: 'PUT',
      data: updates,
    });
  },

  async switchDataMode(mode: 'demo' | 'clean'): Promise<{ success: boolean; message: string }> {
    return apiRequest('/settings/data-mode', {
      method: 'POST',
      data: { mode },
    });
  },

  async getAnalytics(): Promise<AnalyticsSummary> {
    return apiRequest<AnalyticsSummary>('/analytics/overview');
  },

  async getInventoryLogs(): Promise<any[]> {
    return apiRequest<any[]>('/inventory/logs');
  },

  async adjustStock(productId: string, newStock: number, reason: string): Promise<any> {
    return apiRequest('/inventory/adjust', {
      method: 'PUT',
      data: { productId, newStock, reason },
    });
  },
};
