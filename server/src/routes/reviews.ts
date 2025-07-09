import { Router } from 'express';
import { getProductReviews, createReview, updateReview, deleteReview, getUserReviews } from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router: Router = Router();

// Public routes
router.get('/products/:productId/reviews', getProductReviews);

// Protected routes (user-specific)
router.post('/products/:productId/reviews', protect, createReview);
router.put('/reviews/:reviewId', protect, updateReview);
router.delete('/reviews/:reviewId', protect, deleteReview);
router.get('/user/reviews', protect, getUserReviews);

export default router; 