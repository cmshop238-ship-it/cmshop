import { apiRequest } from './api';
import { Order, OrderStatus, PaymentMethod, PaymentStatus, ShippingAddress, ShippingMethod } from '../types';

export interface CreateOrderPayload {
  customer: ShippingAddress;
  items: {
    productId: string;
    quantity: number;
    selectedVariantText?: string;
  }[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  userId?: string;
}

export const orderService = {
  /**
   * Secure Order Creation:
   * Real backend re-evaluates all item prices and stocks atomically to prevent client tampering.
   */
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await apiRequest<Order>('/orders', {
      method: 'POST',
      data: payload,
    });
    return res;
  },

  /**
   * Get orders for current user or admin
   */
  async getOrders(status?: string): Promise<Order[]> {
    const qs = status && status !== 'all' ? `?status=${status}` : '';
    return apiRequest<Order[]>(`/orders${qs}`);
  },

  /**
   * Find order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    return apiRequest<Order>(`/orders/${id}`);
  },

  /**
   * Admin update order status
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  /**
   * Admin update payment status
   */
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
    return apiRequest<Order>(`/orders/${orderId}/payment-status`, {
      method: 'PUT',
      data: { paymentStatus },
    });
  },
};
