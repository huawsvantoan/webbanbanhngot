import { Router } from 'express';
import { getAllReviews, getReviewById, updateReview, deleteReview, updateReviewStatus } from '../controllers/reviewController';
import { protect, authorize } from '../middleware/auth';

const router: Router = Router();

// Admin routes for reviews
router.route('/reviews').get(protect, authorize(['admin']), getAllReviews);
router.route('/reviews/:reviewId')
  .get(protect, authorize(['admin']), getReviewById)
  .put(protect, authorize(['admin']), updateReview)
  .delete(protect, authorize(['admin']), deleteReview);

// Route to update review status
router.route('/reviews/:reviewId/status')
  .put(protect, authorize(['admin']), updateReviewStatus);

export default router; 