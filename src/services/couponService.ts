import { apiRequest } from './api';
import { Coupon } from '../types';

export interface CouponValidationResult {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  description: string;
}

export const couponService = {
  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    return apiRequest<CouponValidationResult>('/coupons/validate', {
      method: 'POST',
      data: { code, subtotal },
    });
  },

  async getCoupons(): Promise<Coupon[]> {
    return apiRequest<Coupon[]>('/coupons');
  },

  async createCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    return apiRequest<Coupon>('/coupons', {
      method: 'POST',
      data: couponData,
    });
  },

  async updateCoupon(code: string, updates: Partial<Coupon>): Promise<Coupon> {
    return apiRequest<Coupon>(`/coupons/${code}`, {
      method: 'PUT',
      data: updates,
    });
  },

  async deleteCoupon(code: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/coupons/${code}`, {
      method: 'DELETE',
    });
  },
};
