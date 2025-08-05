import api from './api';

export interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  position: number;
  isDeleted?: number;
}

export interface CreateBannerData {
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
  position: number;
  is_active: number;
}

export interface UpdateBannerData extends Partial<CreateBannerData> {
  id: number;
}

// Get public banners (for homepage)
export const getPublicBanners = async (): Promise<Banner[]> => {
  const response = await api.get('/banners');
  return response.data;
};

// Get all banners (admin only) - bao gồm cả đã xóa mềm
export const getBanners = async (): Promise<Banner[]> => {
  const response = await api.get('/admin/banners');
  return response.data;
};

// Create new banner (admin only)
export const createBanner = async (data: CreateBannerData): Promise<Banner> => {
  const response = await api.post('/admin/banners', data);
  return response.data;
};

// Update banner (admin only)
export const updateBanner = async (id: number, data: Partial<CreateBannerData>): Promise<Banner> => {
  const response = await api.put(`/admin/banners/${id}`, data);
  return response.data;
};

// Delete banner (admin only)
export const deleteBanner = async (id: number): Promise<void> => {
  await api.delete(`/admin/banners/${id}`);
};

// Toggle banner active status (admin only)
export const toggleBannerActive = async (id: number, isActive: boolean): Promise<Banner> => {
  const response = await api.put(`/admin/banners/${id}`, { is_active: isActive });
  return response.data;
}; 