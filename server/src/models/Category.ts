import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface ICategory extends RowDataPacket {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  isDeleted: number;
}

export class Category {
  static async findAll(includeDeleted = false): Promise<ICategory[]> {
    const query = includeDeleted
      ? 'SELECT * FROM categories ORDER BY name'
      : 'SELECT * FROM categories WHERE isDeleted = 0 ORDER BY name';
    const [rows] = await pool.query<ICategory[]>(query);
    return rows;
  }

  static async findById(id: number, includeDeleted = false): Promise<ICategory | null> {
    const [rows] = await pool.query<ICategory[]>(
      includeDeleted
        ? 'SELECT * FROM categories WHERE id = ?'
        : 'SELECT * FROM categories WHERE id = ? AND isDeleted = 0',
      [id]
    );
    return rows[0] || null;
  }

  static async create(data: Omit<ICategory, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
      [data.name, data.description, data.image_url]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<ICategory>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined);

    if (fields.length === 0) return false;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE categories SET isDeleted = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async restore(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE categories SET isDeleted = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getProductCount(id: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND isDeleted = 0', [id]
    );
    return rows[0]?.count || 0;
  }

  static async deletePermanent(id: number): Promise<any> {
    return pool.query('DELETE FROM categories WHERE id = ?', [id]);
  }
} 