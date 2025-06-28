import { Router } from 'express';
import * as productController from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import * as reviewController from '../controllers/reviewController';

const router = Router();

router.get('/', asyncHandler(productController.getAllProducts));
router.get('/search', asyncHandler(productController.searchProducts));
router.get('/:id', asyncHandler(productController.getProductById));
router.post('/', protect, authorize(['admin']), productController.upload.single('image'), asyncHandler(productController.createProduct));
router.put('/:id', protect, authorize(['admin']), productController.upload.single('image'), asyncHandler(productController.updateProduct));
router.put('/:id/restore', protect, authorize(['admin']), asyncHandler(productController.restoreProduct));
router.delete('/:id', protect, authorize(['admin']), asyncHandler(productController.deleteProduct));
router.delete('/:id/permanent', protect, authorize(['admin']), asyncHandler(productController.deleteProductPermanent));
router.post('/:id/reviews', protect, reviewController.createReview);
router.get('/:id/reviews', reviewController.getProductReviews);

export default router; 