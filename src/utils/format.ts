import { OrderStatus, PaymentMethod, PaymentStatus } from '../types';

/**
 * Format currency in VND with Vietnamese standard dot notation
 * e.g., 850000 -> "850.000đ"
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0đ';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

/**
 * Format Date to Vietnamese readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercent(originalPrice?: number, salePrice?: number): number {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Order status human labels and styling
 */
export function getOrderStatusInfo(status: OrderStatus): { label: string; bg: string; text: string; dot: string } {
  switch (status) {
    case 'pending':
      return { label: 'Chờ xử lý', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500' };
    case 'confirmed':
      return { label: 'Đã xác nhận', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500' };
    case 'processing':
      return { label: 'Đang chuẩn bị', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', dot: 'bg-purple-500' };
    case 'shipping':
      return { label: 'Đang giao hàng', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-800', dot: 'bg-indigo-500' };
    case 'delivered':
      return { label: 'Đã giao hàng', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' };
    case 'cancelled':
      return { label: 'Đã hủy', bg: 'bg-stone-100 border-stone-300', text: 'text-stone-600', dot: 'bg-stone-400' };
    default:
      return { label: status, bg: 'bg-stone-50 border-stone-200', text: 'text-stone-700', dot: 'bg-stone-400' };
  }
}

/**
 * Payment method human labels
 */
export function getPaymentMethodName(method: PaymentMethod): string {
  switch (method) {
    case 'cod':
      return 'Thanh toán khi nhận hàng (COD)';
    case 'bank_transfer':
      return 'Chuyển khoản ngân hàng (VietQR)';
    case 'vnpay':
      return 'Cổng thanh toán VNPAY-QR';
    case 'momo':
      return 'Ví điện tử MoMo';
    case 'zalopay':
      return 'Ví điện tử ZaloPay';
    case 'credit_card':
      return 'Thẻ Quốc tế (Visa / Master / JCB)';
    default:
      return method;
  }
}

/**
 * Payment status human labels
 */
export function getPaymentStatusInfo(status: PaymentStatus): { label: string; text: string } {
  switch (status) {
    case 'paid':
      return { label: 'Đã thanh toán', text: 'text-emerald-700 font-medium' };
    case 'unpaid':
      return { label: 'Chưa thanh toán', text: 'text-amber-700 font-medium' };
    case 'refunded':
      return { label: 'Đã hoàn tiền', text: 'text-stone-600 font-medium' };
    case 'failed':
      return { label: 'Giao dịch thất bại', text: 'text-rose-700 font-medium' };
  }
}

/**
 * Generate VietQR Quick Link for bank transfer
 * Bank: MB Bank (970422), Account: 0589614334, Name: PHAM QUANG THANH
 */
export function getVietQRUrl(amount: number, orderId: string): string {
  const bankId = 'MB'; // MB Bank
  const accountNo = '0589614334';
  const template = 'compact2';
  const accountName = encodeURIComponent('PHAM QUANG THANH');
  const memo = encodeURIComponent(`CM ${orderId}`);
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
}
