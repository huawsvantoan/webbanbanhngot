import api from './api';
import { Product } from './productService';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  shipping_address: string;
  phone: string;
  email?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  payment_method?: 'cod' | 'vnpay';
}

export interface CreateOrderData {
  shipping_address: string;
  phone: string;
}

const orderService = {
  async createOrder(data: CreateOrderData): Promise<{ message: string; orderId: number }> {
    const response = await api.post<{ message: string; orderId: number }>('/orders', data);
    return response.data;
  },

  async getOrderById(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/my-orders');
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  async updateOrderStatus(id: number, status: Order['status'], note?: string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>(`/orders/${id}/status`, { status, note });
    return response.data;
  },

  // Helper function to format order status
  formatStatus(status: Order['status']): string {
    const statusMap: Record<Order['status'], string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành',
    };
    return statusMap[status];
  },
};

export default orderService; 