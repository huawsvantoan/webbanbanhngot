import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IBlogPost extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string; // Optional vì không có trong DB
  image_url: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[]; // Optional vì không có trong DB
  view_count: number;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  isDeleted: number;
  author_name?: string;
}

export class BlogPost {
  static async findAll(includeDeleted = false): Promise<IBlogPost[]> {
    const query = includeDeleted
      ? `SELECT bp.*, u.full_name as author_name 
         FROM blog_posts bp 
         LEFT JOIN users u ON bp.user_id = u.id 
         ORDER BY bp.created_at DESC`
      : `SELECT bp.*, u.full_name as author_name 
         FROM blog_posts bp 
         LEFT JOIN users u ON bp.user_id = u.id 
         WHERE bp.isDeleted = 0 
         ORDER BY bp.created_at DESC`;
    const [rows] = await pool.query<IBlogPost[]>(query);
    return rows;
  }

  static async findById(id: number, includeDeleted = false): Promise<IBlogPost | null> {
    const query = includeDeleted
      ? `SELECT bp.*, u.full_name as author_name 
         FROM blog_posts bp 
         LEFT JOIN users u ON bp.user_id = u.id 
         WHERE bp.id = ?`
      : `SELECT bp.*, u.full_name as author_name 
         FROM blog_posts bp 
         LEFT JOIN users u ON bp.user_id = u.id 
         WHERE bp.id = ? AND bp.isDeleted = 0`;
    const [rows] = await pool.query<IBlogPost[]>(query, [id]);
    return rows[0] || null;
  }

  static async create(data: Omit<IBlogPost, 'id' | 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'author_name' | 'excerpt' | 'tags'>): Promise<number> {
    const [result] = await pool.query<any>(
      'INSERT INTO blog_posts (user_id, title, slug, content, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [data.user_id, data.title, data.slug, data.content, data.image_url, data.status]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<IBlogPost>): Promise<boolean> {
    const updateData: any = { ...data };
    
    // Loại bỏ excerpt và tags vì không có trong DB
    delete updateData.excerpt;
    delete updateData.tags;
    
    const fields = Object.keys(updateData)
      .filter(key => updateData[key] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(updateData).filter(value => value !== undefined);
    if (fields.length === 0) return false;
    
    const [result] = await pool.query<any>(
      `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE blog_posts SET isDeleted = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async restore(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE blog_posts SET isDeleted = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deletePermanent(id: number): Promise<any> {
    return pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
  }
} 