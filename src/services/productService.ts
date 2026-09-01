import { apiRequest } from './api';
import { Product } from '../types';

export interface ProductFilterParams {
  category?: string;
  search?: string;
  status?: string;
}

export const productService = {
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    const qs = query.toString();
    return apiRequest<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    return apiRequest<Product[]>('/products/admin');
  },

  async getProductByIdentifier(identifier: string): Promise<Product> {
    return apiRequest<Product>(`/products/${identifier}`);
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return apiRequest<Product>('/products', {
      method: 'POST',
      data: productData,
    });
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    return apiRequest<Product>(`/products/${id}`, {
      method: 'PUT',
      data: productData,
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
