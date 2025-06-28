import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface IComment extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  parent_id?: number;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICommentWithUser extends IComment {
  user: {
    id: number;
    username: string;
    full_name?: string;
  };
  replies?: ICommentWithUser[];
}

export class Comment {
  static async findByProductId(productId: number): Promise<ICommentWithUser[]> {
    const [rows] = await pool.query<ICommentWithUser[]>(`
      SELECT c.*, u.id as 'user.id', u.username as 'user.username', u.full_name as 'user.full_name'
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.product_id = ? AND c.parent_id IS NULL
      ORDER BY c.created_at DESC
    `, [productId]);

    // Get replies for each comment
    for (const comment of rows) {
      comment.replies = await this.getReplies(comment.id);
    }

    return rows;
  }

  static async getReplies(parentId: number): Promise<ICommentWithUser[]> {
    const [rows] = await pool.query<ICommentWithUser[]>(`
      SELECT c.*, u.id as 'user.id', u.username as 'user.username', u.full_name as 'user.full_name'
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = ?
      ORDER BY c.created_at ASC
    `, [parentId]);
    return rows;
  }

  static async findById(id: number): Promise<ICommentWithUser | null> {
    const [rows] = await pool.query<ICommentWithUser[]>(`
      SELECT c.*, u.id as 'user.id', u.username as 'user.username', u.full_name as 'user.full_name'
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [id]);
    return rows[0] || null;
  }

  static async create(data: Omit<IComment, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO comments (user_id, product_id, parent_id, content) VALUES (?, ?, ?, ?)',
      [data.user_id, data.product_id, data.parent_id, data.content]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<IComment>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined)
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined);

    if (fields.length === 0) return false;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE comments SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    // Delete replies first
    await pool.query('DELETE FROM comments WHERE parent_id = ?', [id]);
    
    // Delete the comment
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async findByUserId(userId: number): Promise<IComment[]> {
    const [rows] = await pool.query<IComment[]>('SELECT * FROM comments WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }
} 