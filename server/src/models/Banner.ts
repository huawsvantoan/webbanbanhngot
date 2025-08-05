import { pool } from '../config/database';

export interface Banner {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
  position: number;
  is_active: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
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

export class BannerModel {
  // Get all active banners (for public)
  static async getActiveBanners(): Promise<Banner[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM banners WHERE is_active = 1 AND deleted_at IS NULL ORDER BY position ASC'
    );
    return rows as Banner[];
  }

  // Get all banners (for admin) - bao gồm cả đã xóa mềm
  static async getAllBanners(): Promise<Banner[]> {
    const [rows] = await pool.execute(
      'SELECT *, CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END as isDeleted FROM banners ORDER BY position ASC'
    );
    return rows as Banner[];
  }

  // Get all deleted banners (for admin)
  static async getDeletedBanners(): Promise<Banner[]> {
    const [rows] = await pool.execute(
      'SELECT * FROM banners WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
    );
    return rows as Banner[];
  }

  // Get banner by ID
  static async getBannerById(id: number): Promise<Banner | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM banners WHERE id = ?',
      [id]
    );
    const banners = rows as Banner[];
    return banners.length > 0 ? banners[0] : null;
  }

  // Get banner by position
  static async getBannerByPosition(position: number): Promise<Banner | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM banners WHERE position = ?',
      [position]
    );
    const banners = rows as Banner[];
    return banners.length > 0 ? banners[0] : null;
  }

  // Get next available position
  static async getNextAvailablePosition(): Promise<number> {
    const [rows] = await pool.execute(
      'SELECT MAX(position) as maxPosition FROM banners'
    );
    const result = rows as any[];
    const maxPosition = result[0]?.maxPosition || 0;
    return maxPosition + 1;
  }

  // Create new banner
  static async createBanner(data: CreateBannerData): Promise<Banner> {
    const [result] = await pool.execute(
      `INSERT INTO banners (title, description, image_url, link_url, position, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.description,
        data.image_url,
        data.link_url,
        data.position,
        data.is_active
      ]
    );
    
    const insertResult = result as any;
    return {
      id: insertResult.insertId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // Update banner
  static async updateBanner(id: number, data: Partial<CreateBannerData>): Promise<Banner | null> {
    const banner = await this.getBannerById(id);
    if (!banner) return null;

    const updateFields = [];
    const updateValues = [];

    if (data.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(data.title);
    }
    if (data.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(data.description);
    }
    if (data.image_url !== undefined) {
      updateFields.push('image_url = ?');
      updateValues.push(data.image_url);
    }
    if (data.link_url !== undefined) {
      updateFields.push('link_url = ?');
      updateValues.push(data.link_url);
    }
    if (data.position !== undefined) {
      updateFields.push('position = ?');
      updateValues.push(data.position);
    }
    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(data.is_active);
    }

    if (updateFields.length === 0) return banner;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    await pool.execute(
      `UPDATE banners SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    return this.getBannerById(id);
  }

  // Soft delete banner
  static async softDeleteBanner(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE banners SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  // Hard delete banner
  static async hardDeleteBanner(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM banners WHERE id = ?',
      [id]
    );
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  }

  // Restore soft deleted banner
  static async restoreBanner(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'UPDATE banners SET deleted_at = NULL WHERE id = ?',
      [id]
    );
    const restoreResult = result as any;
    return restoreResult.affectedRows > 0;
  }

  // Toggle banner active status
  static async toggleActive(id: number, isActive: number): Promise<Banner | null> {
    await pool.execute(
      'UPDATE banners SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isActive, id]
    );
    return this.getBannerById(id);
  }

  // Fix duplicate positions automatically
  static async fixDuplicatePositions(): Promise<void> {
    const [rows] = await pool.execute(
      'SELECT id, position FROM banners ORDER BY id'
    );
    const banners = rows as any[];
    
    const usedPositions = new Set<number>();
    const updates: Array<{ id: number, newPosition: number }> = [];

    for (const banner of banners) {
      let newPosition = banner.position;
      
      // Nếu vị trí đã được sử dụng, tìm vị trí tiếp theo
      while (usedPositions.has(newPosition)) {
        newPosition++;
      }
      
      usedPositions.add(newPosition);
      
      // Nếu vị trí thay đổi, thêm vào danh sách cập nhật
      if (newPosition !== banner.position) {
        updates.push({ id: banner.id, newPosition });
      }
    }

    // Thực hiện cập nhật
    for (const update of updates) {
      await pool.execute(
        'UPDATE banners SET position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [update.newPosition, update.id]
      );
    }

    if (updates.length > 0) {
      console.log(`Đã tự động sửa ${updates.length} vị trí trùng lặp`);
    }
  }
} 