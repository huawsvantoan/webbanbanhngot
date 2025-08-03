export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  image?: string;
  stock: number;
  category_id: number | null;
  category_name?: string;
  category?: Category;
  created_at: string;
  updated_at: string;
  full_name?: string;
  isDeleted: number;
  // Các trường mới cho tính năng nổi bật/hot
  is_featured?: boolean;
  is_hot?: boolean;
  discount_percent?: number;
  original_price?: number;
  view_count?: number;
  rating_avg?: number;
  rating_count?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  user?: User;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string;
  phone: string;
  note?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  address?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
} 