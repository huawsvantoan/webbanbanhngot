import api from './api';
import { Product } from '../types/product';

export type { Product };

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  category_id?: number;
  stock: number;
  image?: File;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const productService = {
  async getAllProducts(page: number = 1, limit: number = 12, search?: string, category?: number): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category.toString());
    
    const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(categoryId: number, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    params.append('category', categoryId.toString());
    
    const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  async searchProducts(query: string, page: number = 1, limit: number = 12): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response.data;
  },

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/featured?limit=${limit}`);
    return response.data;
  },

  async getHotProducts(limit: number = 4): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/hot?limit=${limit}`);
    return response.data;
  },

  async createProduct(data: CreateProductData): Promise<{ message: string; productId: number }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post<{ message: string; productId: number }>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateProduct(data: UpdateProductData): Promise<{ message: string }> {
    const { id, ...updateData } = data;
    const formData = new FormData();
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.put<{ message: string }>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },
};

export default productService; 