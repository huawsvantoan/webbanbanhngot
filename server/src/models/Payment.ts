import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';

export interface IPayment extends RowDataPacket {
  id: number;
  order_id: number;
  payment_method: string;
  transaction_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  vnpay_transaction_no?: string;
  refund_transaction_no?: string;
  refund_amount?: number;
  refund_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export class Payment {
  static async create(data: {
    order_id: number;
    payment_method: string;
    amount: number;
    transaction_id?: string;
    vnpay_transaction_no?: string;
  }): Promise<number> {
    const [result] = await pool.query<any>(
      'INSERT INTO payments (order_id, payment_method, amount, transaction_id, vnpay_transaction_no) VALUES (?, ?, ?, ?, ?)',
      [data.order_id, data.payment_method, data.amount, data.transaction_id, data.vnpay_transaction_no]
    );
    return result.insertId;
  }

  static async findByOrderId(orderId: number): Promise<IPayment | null> {
    const [rows] = await pool.query<IPayment[]>(
      'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByVnpayTransaction(transactionNo: string): Promise<IPayment | null> {
    const [rows] = await pool.query<IPayment[]>(
      'SELECT * FROM payments WHERE vnpay_transaction_no = ?',
      [transactionNo]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async updateStatus(id: number, status: IPayment['status']): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE payments SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async updateRefund(
    id: number, 
    refundTransactionNo: string, 
    refundAmount: number, 
    refundReason: string
  ): Promise<boolean> {
    const [result] = await pool.query<any>(
      'UPDATE payments SET status = ?, refund_transaction_no = ?, refund_amount = ?, refund_reason = ? WHERE id = ?',
      ['refunded', refundTransactionNo, refundAmount, refundReason, id]
    );
    return result.affectedRows > 0;
  }

  static async findById(id: number): Promise<IPayment | null> {
    const [rows] = await pool.query<IPayment[]>(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
} 