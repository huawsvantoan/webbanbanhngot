import api from './api';
import { Product } from './productService';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

const cartService = {
  async getCart(): Promise<CartItem[]> {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },

  async addToCart(data: AddToCartData): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/cart', data);
    return response.data;
  },

  async updateCartItem(productId: number, quantity: number): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/cart/${productId}`, { quantity });
    return response.data;
  },

  async removeFromCart(productId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/cart/${productId}`);
    return response.data;
  },

  async clearCart(): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>('/cart');
    return response.data;
  },

  // Helper function to calculate total price
  calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
};

export default cartService; 