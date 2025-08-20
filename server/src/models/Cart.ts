import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface ICart extends RowDataPacket {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface ICartItem extends RowDataPacket {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export class Cart {
  static async findByUserId(userId: number): Promise<ICart | null> {
    const [rows] = await pool.query<ICart[]>("SELECT * FROM cart WHERE user_id = ?", [userId]);
    return rows[0] || null;
  }

  static async findById(cartId: number): Promise<ICart | null> {
    const [rows] = await pool.query<ICart[]>("SELECT * FROM cart WHERE id = ?", [cartId]);
    return rows[0] || null;
  }

  static async create(userId: number): Promise<number> {
    const [result] = await pool.query<any>(
      "INSERT INTO cart (user_id) VALUES (?)",
      [userId]
    );
    return result.insertId;
  }

  static async getItems(cartId: number): Promise<any[]> {
    const [rows] = await pool.query<any[]>(
      `SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.price, ci.created_at, ci.updated_at,
              p.name, p.image_url, p.price as product_price, p.stock as product_stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    return rows.map(item => ({
      id: item.id,
      cart_id: item.cart_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
      created_at: item.created_at,
      updated_at: item.updated_at,
      product_stock: Number(item.product_stock),
      product: {
        id: item.product_id,
        name: item.name,
        image_url: item.image_url,
        price: Number(item.product_price),
        stock: Number(item.product_stock)
      }
    }));
  }

  static async getItemByProductId(cartId: number, productId: number): Promise<ICartItem | null> {
    const [rows] = await pool.query<ICartItem[]>(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return rows[0] || null;
  }

  static async addItem(cartId: number, productId: number, quantity: number, price: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [cartId, productId, quantity, price]
    );
    return result.affectedRows > 0;
  }

  static async updateItem(cartItemId: number, quantity: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );
    return result.affectedRows > 0;
  }

  static async updateItemByProductId(cartId: number, productId: number, quantity: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId]
    );
    return result.affectedRows > 0;
  }

  static async removeItem(cartId: number, productId: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );
    return result.affectedRows > 0;
  }

  static async removeItemById(cartItemId: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'DELETE FROM cart_items WHERE id = ?',
      [cartItemId]
    );
    return result.affectedRows > 0;
  }

  static async clearItems(cartId: number): Promise<boolean> {
    const [result] = await pool.query<any>(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );
    return result.affectedRows > 0;
  }
} 