import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IOrder extends RowDataPacket {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  phone: string;
  name: string; // Họ tên người nhận
  note?: string | null; // Ghi chú đơn hàng
  payment_method: string; // 'cod' | 'bank'
  payment_proof: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface IOrderItem extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export class Order {
  static async findAll(): Promise<IOrder[]> {
    const [rows] = await pool.query<IOrder[]>('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id: number): Promise<IOrder | null> {
    const [rows] = await pool.query<IOrder[]>('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findByUserId(userId: number): Promise<IOrder[]> {
    const [rows] = await pool.query<IOrder[]>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async create(data: Omit<IOrder, 'id' | 'created_at' | 'updated_at'>, orderItemsData: Omit<IOrderItem, 'id' | 'created_at' | 'updated_at' | 'order_id'>[]): Promise<number> {
    const { user_id, total_amount, shipping_address, phone, name, note, payment_method, payment_proof, status } = data;
    const [result] = await pool.query<any>(
      'INSERT INTO orders (user_id, total_amount, shipping_address, phone, name, note, payment_method, payment_proof, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, total_amount, shipping_address, phone, name, note, payment_method, payment_proof, status]
    );
    const orderId = result.insertId;

    for (const item of orderItemsData) {
      await this.addItem(orderId, item);
    }

    return orderId;
  }

  static async updateStatus(id: number, status: IOrder['status'], note?: string): Promise<boolean> {
    if (note !== undefined) {
      const [result] = await pool.query<any>(
        'UPDATE orders SET status = ?, note = ? WHERE id = ?',
        [status, note, id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await pool.query<any>(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      return result.affectedRows > 0;
    }
  }

  static async getItems(orderId: number): Promise<IOrderItem[]> {
    const [rows] = await pool.query<IOrderItem[]>(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return rows;
  }

  static async addItem(orderId: number, item: Omit<IOrderItem, 'id' | 'order_id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    const [result] = await pool.query<any>(
      'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.product_id, item.quantity, item.price]
    );
    return result.affectedRows > 0;
  }
} 