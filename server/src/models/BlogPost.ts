import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IBlogPost extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  status: string;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  isDeleted: number;
}

export class BlogPost {
  static async findAll(includeDeleted = false): Promise<IBlogPost[]> {
    const query = includeDeleted
      ? 'SELECT * FROM blog_posts ORDER BY created_at DESC'
      : 'SELECT * FROM blog_posts WHERE isDeleted = 0 ORDER BY created_at DESC';
    const [rows] = await pool.query<IBlogPost[]>(query);
    return rows;
  }

  static async findById(id: number): Promise<IBlogPost | null> {
    const [rows] = await pool.query<IBlogPost[]>(
      'SELECT * FROM blog_posts WHERE id = ? AND isDeleted = 0', [id]);
    return rows[0] || null;
  }

  static async create(data: Omit<IBlogPost, 'id' | 'created_at' | 'updated_at' | 'published_at'>): Promise<number> {
    const [result] = await pool.query<any>(
      'INSERT INTO blog_posts (user_id, title, slug, content, image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [data.user_id, data.title, data.slug, data.content, data.image_url, data.status]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<IBlogPost>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined);
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