import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/database';

export interface IReview extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  rating: number | null; // Allow null for comments
  content?: string; // Renamed from comment
  parent_id?: number | null; // For replies
  created_at: Date;
  updated_at: Date;
}

export interface IReviewWithUser extends IReview {
  user: {
    id: number;
    username: string;
    full_name?: string;
  };
  replies?: IReviewWithUser[]; // Nested replies
}

export class Review {
  static async findById(id: number): Promise<IReview | null> {
    const [rows] = await pool.query<IReview[]>('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async findAll(): Promise<IReview[]> {
    const [rows] = await pool.query<IReview[]>('SELECT * FROM reviews');
    return rows;
  }

  static async findByProductId(productId: number): Promise<IReviewWithUser[]> {
    const [rows] = await pool.query<IReviewWithUser[]>(`
      SELECT 
        r.*, 
        u.id as user_id_alias, 
        u.username as user_username_alias, 
        u.full_name as user_full_name_alias
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at ASC -- Order by ASC to build tree easily
    `, [productId]);

    const reviewsMap = new Map<number, IReviewWithUser>();
    const rootReviews: IReviewWithUser[] = [];

    rows.forEach(row => {
      const review: IReviewWithUser = {
        ...row,
        user: {
          id: row.user_id_alias,
          username: row.user_username_alias,
          full_name: row.user_full_name_alias
        },
        // Remove aliased fields from top level
        user_id_alias: undefined,
        user_username_alias: undefined,
        user_full_name_alias: undefined,
      } as IReviewWithUser;

      if (review.parent_id === null || review.parent_id === undefined) {
        rootReviews.push(review);
      } else {
        let parent = reviewsMap.get(review.parent_id);
        if (parent) {
          if (!parent.replies) {
            parent.replies = [];
          }
          parent.replies.push(review);
        } else {
          // If parent not found, treat as root for now (should ideally not happen with correct data)
          rootReviews.push(review);
        }
      }
      reviewsMap.set(review.id, review);
    });
    
    // Sort root reviews and their replies by created_at DESC for display
    const sortReviews = (arr: IReviewWithUser[]) => {
      arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      arr.forEach(review => {
        if (review.replies) {
          sortReviews(review.replies);
        }
      });
    };
    sortReviews(rootReviews);

    return rootReviews;
  }

  static async findByUserId(userId: number): Promise<IReview[]> {
    const [rows] = await pool.query<IReview[]>('SELECT * FROM reviews WHERE user_id = ? AND parent_id IS NULL ORDER BY created_at DESC', [userId]);
    return rows;
  }

  static async findByUserIdAndProductId(userId: number, productId: number): Promise<IReview | null> {
    const [rows] = await pool.query<IReview[]>('SELECT * FROM reviews WHERE user_id = ? AND product_id = ? AND rating IS NOT NULL', [userId, productId]);
    return rows[0] || null;
  }

  static async create(data: Omit<IReview, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO reviews (user_id, product_id, rating, content, parent_id) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.product_id, data.rating || null, data.content || null, data.parent_id || null]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<IReview>): Promise<boolean> {
    const fields = Object.keys(data)
      .filter(key => data[key as keyof typeof data] !== undefined && key !== 'replies')
      .map(key => `${key} = ?`);
    const values = Object.values(data).filter(value => value !== undefined && value !== null && typeof value !== 'object');

    if (fields.length === 0) return false;

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM reviews WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAverageRating(productId: number): Promise<number> {
    // Only consider top-level reviews (parent_id IS NULL) with a rating
    const [rows] = await pool.query<RowDataPacket[]>('SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ? AND rating IS NOT NULL AND parent_id IS NULL', [productId]);
    return rows[0]?.avg_rating || 0;
  }

  static async getRatingCount(productId: number): Promise<number> {
    // Only count top-level reviews (parent_id IS NULL) with a rating
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND rating IS NOT NULL AND parent_id IS NULL', [productId]);
    return rows[0]?.count || 0;
  }
} 