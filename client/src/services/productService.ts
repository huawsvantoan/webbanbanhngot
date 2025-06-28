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

const productService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/search?query=${encodeURIComponent(query)}`);
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