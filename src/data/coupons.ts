import { Coupon } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'CM10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 500000,
    maxDiscount: 500000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 128,
    isActive: true,
    description: 'Giảm 10% cho tất cả đơn hàng từ 500.000₫ (Tối đa 500k)'
  },
  {
    code: 'WELCOME',
    discountType: 'fixed',
    discountValue: 150000,
    minimumOrder: 1000000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 1000,
    usageCount: 420,
    isActive: true,
    description: 'Ưu đãi 150.000₫ chào mừng quý khách (Đơn từ 1.000.000₫)'
  },
  {
    code: 'NEWUSER',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrder: 1500000,
    maxDiscount: 800000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 300,
    usageCount: 89,
    isActive: true,
    description: 'Giảm 15% cho thành viên mới (Đơn từ 1.500.000₫)'
  },
  {
    code: 'VIPCM',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrder: 3000000,
    maxDiscount: 1500000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 42,
    isActive: true,
    description: 'Đặc quyền VIP giảm 20% cho đơn hàng từ 3.000.000₫'
  }
];
