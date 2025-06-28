import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

console.log("Category routes loaded.");
const router: Router = Router();

// Public routes
router.get('/', asyncHandler(categoryController.getAllCategories));
router.get('/:id', asyncHandler(categoryController.getCategoryById));

// Admin routes
router.post('/', protect, authorize(['admin']), asyncHandler(categoryController.createCategory));
router.put('/:id', protect, authorize(['admin']), asyncHandler(categoryController.updateCategory));
router.delete('/:id/permanent', protect, authorize(['admin']), categoryController.deleteCategoryPermanent);
router.delete('/:id', protect, authorize(['admin']), asyncHandler(categoryController.deleteCategory));
router.put('/:id/restore', protect, authorize(['admin']), asyncHandler(categoryController.restoreCategory));

export default router; 