import { Request, Response } from 'express';
import { Review, IReview } from '../models/Review';
import { Product } from '../models/Product';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    const reviews = await Review.findByProductId(productId);
    let averageRatingRaw = await Review.getAverageRating(productId);
    let averageRating = Number(averageRatingRaw);
    if (isNaN(averageRating)) averageRating = 0;
    const ratingCount = await Review.getRatingCount(productId);

    return res.json({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingCount
    });
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy đánh giá' });
  }
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    const productId = parseInt(req.params.id);
    const { rating, content, parent_id } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    // Validate rating only if it's provided and not null
    if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao hoặc không có' });
    }
    if ((rating === undefined || rating === null) && (!content || !content.trim())) {
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }
    if (content && content.length > 1000) {
      return res.status(400).json({ message: 'Nội dung bình luận không được vượt quá 1000 ký tự' });
    }
    if (content && /[<>$]/.test(content)) {
      return res.status(400).json({ message: 'Nội dung bình luận chứa ký tự không hợp lệ' });
    }

    // If it's a review (has a rating) and no parent_id, check for existing review from this user for this product
    if (rating !== null && (parent_id === undefined || parent_id === null)) {
      const existingReview = await Review.findByUserIdAndProductId(req.user.id, productId);
      if (existingReview) {
        return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi' });
      }
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // If parent_id is provided, check if parent review exists
    if (parent_id !== undefined && parent_id !== null) {
      const parentReview = await Review.findById(parent_id);
      if (!parentReview) {
        return res.status(400).json({ message: 'Bình luận gốc không tồn tại' });
      }
      // Ensure the reply is for the same product as the parent
      if (parentReview.product_id !== productId) {
        return res.status(400).json({ message: 'Bình luận gốc không thuộc sản phẩm này' });
      }
    }

    const reviewId = await Review.create({
      user_id: req.user.id,
      product_id: productId,
      rating: rating === undefined ? null : rating,
      content: content || null,
      parent_id: parent_id || null
    });

    const newReview = await Review.findById(reviewId);
    return res.status(201).json({ message: 'Đánh giá/bình luận đã được tạo thành công', review: newReview });
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá/bình luận:', error);
    return res.status(500).json({ message: 'Lỗi khi tạo đánh giá/bình luận' });
  }
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    const reviewId = parseInt(req.params.reviewId);
    const { rating, content } = req.body;

    if (isNaN(reviewId)) {
      return res.status(400).json({ message: 'ID đánh giá không hợp lệ' });
    }

    // Validate rating if it's provided and not null
    if (rating !== undefined && rating !== null && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao hoặc không có' });
    }

    // Check if review exists and belongs to user
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Bạn chỉ có thể chỉnh sửa đánh giá/bình luận của mình' });
    }

    const updateData: Partial<IReview> = {};
    if (rating !== undefined) updateData.rating = rating;
    if (content !== undefined) updateData.content = content;

    const success = await Review.update(reviewId, updateData);

    if (!success) {
      return res.status(500).json({ message: 'Cập nhật đánh giá/bình luận thất bại' });
    }

    const updatedReview = await Review.findById(reviewId);
    return res.json({ message: 'Đánh giá/bình luận đã được cập nhật thành công', review: updatedReview });
  } catch (error) {
    console.error('Lỗi khi cập nhật đánh giá/bình luận:', error);
    return res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá/bình luận' });
  }
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    const reviewId = parseInt(req.params.reviewId);

    if (isNaN(reviewId)) {
      return res.status(400).json({ message: 'ID đánh giá không hợp lệ' });
    }

    // Check if review exists and belongs to user
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn chỉ có thể xóa đánh giá/bình luận của mình' });
    }

    const success = await Review.delete(reviewId);
    if (!success) {
      return res.status(500).json({ message: 'Xóa đánh giá/bình luận thất bại' });
    }

    return res.json({ message: 'Đánh giá/bình luận đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá/bình luận:', error);
    return res.status(500).json({ message: 'Lỗi khi xóa đánh giá/bình luận' });
  }
});

export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }

    const reviews = await Review.findByUserId(req.user.id);
    return res.json({ reviews });
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá người dùng:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy đánh giá người dùng' });
  }
});

// Admin functions
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reviews = await Review.findAll();
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Lỗi khi lấy tất cả đánh giá:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy tất cả đánh giá' });
  }
});

export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    if (isNaN(reviewId)) {
      return res.status(400).json({ message: 'ID đánh giá không hợp lệ' });
    }
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    return res.status(200).json(review);
  } catch (error) {
    console.error('Lỗi khi lấy đánh giá theo ID:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy đánh giá theo ID' });
  }
}); 