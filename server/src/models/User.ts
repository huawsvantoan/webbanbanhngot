import { RowDataPacket } from 'mysql2';
import { pool } from '../config/database';
import bcrypt from 'bcrypt';

export interface IUser extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  address: string;
  phone: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
  isDeleted: number;
}

export interface IPasswordResetCode {
  id?: number;
  email: string;
  code: string;
  expires_at: Date;
  created_at?: Date;
}

export class User {
  static async findAll(includeDeleted = false): Promise<IUser[]> {
    const query = includeDeleted
      ? 'SELECT * FROM users'
      : 'SELECT * FROM users WHERE isDeleted = 0';
    const [rows] = await pool.query<IUser[]>(query);
    return rows;
  }

  static async findById(id: number): Promise<IUser | null> {
    const [rows] = await pool.query<IUser[]>(
      'SELECT * FROM users WHERE id = ? AND isDeleted = 0', [id]);
    return rows[0] || null;
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.query<IUser[]>('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async create(data: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const [result] = await pool.query<any>(
      'INSERT INTO users (username, email, password, full_name, address, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [data.username, data.email, hashedPassword, data.full_name, data.address, data.phone, data.role || 'user']
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<IUser>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined);

    if (fields.length === 0) return false;

    const [result] = await pool.query<any>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE users SET isDeleted = 1 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query<any>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  }

  static async restore(id: number): Promise<boolean> {
    const [result] = await pool.query<any>('UPDATE users SET isDeleted = 0 WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deletePermanent(id: number): Promise<any> {
    return pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

export class PasswordResetCode {
  static async create(email: string, code: string, expires_at: Date): Promise<number> {
    const [result] = await pool.query<any>(
      'INSERT INTO password_reset_codes (email, code, expires_at) VALUES (?, ?, ?)',
      [email, code, expires_at]
    );
    return result.insertId;
  }

  static async findValidCode(email: string, code: string): Promise<IPasswordResetCode | null> {
    const [rows] = await pool.query<any>(
      'SELECT * FROM password_reset_codes WHERE email = ? AND code = ? AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email, code]
    );
    return rows[0] || null;
  }

  static async deleteByEmail(email: string): Promise<void> {
    await pool.query('DELETE FROM password_reset_codes WHERE email = ?', [email]);
  }
} 