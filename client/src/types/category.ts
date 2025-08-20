export interface Category {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  product_count?: number;
  created_at: string;
  updated_at: string;
  isDeleted: number;
} 