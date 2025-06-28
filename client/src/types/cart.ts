import { Product } from './product';

export type { Product };

export interface CartItem {
  id: number;
  user_id: number;
  product: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
} 