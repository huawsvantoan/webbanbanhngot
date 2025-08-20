import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IProduct extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  stock: number;
  created_at: Date;
  updated_at: Date;
  isDeleted: number;
  // Các trường mới
  is_featured?: boolean;
  is_hot?: boolean;
  discount_percent?: number;
  original_price?: number;
  view_count?: number;
  rating_avg?: number;
  rating_count?: number;
}

export class Product {
  static async findAll(
    options: {
      includeDeleted?: boolean,
      search?: string,
      categoryId?: number,
      featured?: boolean,
      hot?: boolean,
      limit?: number,
      offset?: number
    } = {}
  ): Promise<IProduct[]> {
    const { includeDeleted = false, search, categoryId, featured, hot, limit, offset } = options;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    
    if (!includeDeleted) {
      query += ' AND isDeleted = 0';
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
      query += ' AND category_id = ?';
      params.push(categoryId);
    }
    if (featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(featured);
    }
    if (hot !== undefined) {
      query += ' AND is_hot = ?';
      params.push(hot);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    const [rows] = await pool.query<IProduct[]>(query, params);
    return rows.map(product => ({ ...product, price: parseFloat(product.price as any) }));
  }

  static async findById(id: number): Promise<IProduct | null> {
    const [rows] = await pool.query<IProduct[]>('SELECT * FROM products WHERE id = ? AND isDeleted = 0', [id]);
    const product = rows[0] || null;
    return product ? { ...product, price: parseFloat(product.price as any) } : null;
  }

  static async create(data: Omit<IProduct, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    try {
      console.log('Creating product with data:', data);
      
      const [result] = await pool.query<any>(
        'INSERT INTO products (name, description, price, category_id, image_url, stock, is_featured, is_hot, discount_percent, original_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          data.name, 
          data.description || '', 
          data.price, 
          data.category_id, 
          data.image_url || '/images/default-cake.jpg', 
          data.stock,
          data.is_featured || false,
          data.is_hot || false,
          data.discount_percent || 0,
          data.original_price || null
        ]
      );
      
      console.log('Product created with ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Database error in Product.create:', error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<IProduct>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined);

    if (fields.length === 0) return false;

    const [result] = await pool.query<any>(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE products SET isDeleted = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query: string): Promise<IProduct[]> {
    const [rows] = await pool.query<IProduct[]>(
      'SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?) AND isDeleted = 0',
      [`%${query}%`, `%${query}%`]
    );
    return rows.map(product => ({ ...product, price: parseFloat(product.price as any) }));
  }

  static async restore(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE products SET isDeleted = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deletePermanent(id: number): Promise<any> {
    return pool.query('DELETE FROM products WHERE id = ?', [id]);
  }

  // Các method mới cho tính năng nổi bật/hot
  static async getFeaturedProducts(limit: number = 6): Promise<IProduct[]> {
    const [rows] = await pool.query<IProduct[]>(
      'SELECT * FROM products WHERE is_featured = TRUE AND isDeleted = 0 ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(product => ({ ...product, price: parseFloat(product.price as any) }));
  }

  static async getHotProducts(limit: number = 6): Promise<IProduct[]> {
    const [rows] = await pool.query<IProduct[]>(
      'SELECT * FROM products WHERE is_hot = TRUE AND isDeleted = 0 ORDER BY view_count DESC, created_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(product => ({ ...product, price: parseFloat(product.price as any) }));
  }

  static async incrementViewCount(id: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE products SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async updateRating(id: number, ratingAvg: number, ratingCount: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE products SET rating_avg = ?, rating_count = ? WHERE id = ?',
      [ratingAvg, ratingCount, id]
    );
    return result.affectedRows > 0;
  }
} 