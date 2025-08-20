import express from 'express';
import { getBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost, getBlogs, restoreBlogPost, deleteBlogPostPermanent } from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/public', getBlogs);

// Admin routes
router.route('/').get(protect, authorize(['admin']), getBlogPosts).post(protect, authorize(['admin']), createBlogPost);
router.route('/:id').get(protect, authorize(['admin']), getBlogPostById).put(protect, authorize(['admin']), updateBlogPost).delete(protect, authorize(['admin']), deleteBlogPost);
router.put('/:id/restore', protect, authorize(['admin']), restoreBlogPost);
router.delete('/:id/permanent', protect, authorize(['admin']), deleteBlogPostPermanent);

export default router; 