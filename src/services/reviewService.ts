import { apiRequest } from './api';
import { ProductReview } from '../types';

export interface ReviewModelDto extends ProductReview {
  productId: string;
  userId?: string;
  status: 'active' | 'hidden';
}

export const reviewService = {
  async getReviewsForProduct(productId: string): Promise<ProductReview[]> {
    return apiRequest<ProductReview[]>(`/reviews/product/${productId}`);
  },

  async submitReview(data: {
    productId: string;
    userName: string;
    rating: number;
    comment: string;
    userId?: string;
    userAvatar?: string;
    verifiedPurchase?: boolean;
  }): Promise<ProductReview> {
    return apiRequest<ProductReview>('/reviews', {
      method: 'POST',
      data,
    });
  },

  async getAllReviewsAdmin(): Promise<ReviewModelDto[]> {
    return apiRequest<ReviewModelDto[]>('/reviews/admin');
  },

  async updateReviewStatus(id: string, status: 'active' | 'hidden'): Promise<ReviewModelDto> {
    return apiRequest<ReviewModelDto>(`/reviews/${id}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  async deleteReview(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};
