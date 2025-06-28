import express from 'express';
import { getBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost, getBlogs, getBlogsPublic, deleteBlogPostPermanent } from '../controllers/blogController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/public', getBlogsPublic);
router.route('/').get(protect, authorize(['admin']), getBlogPosts).post(protect, authorize(['admin']), createBlogPost);
router.route('/:id').get(protect, authorize(['admin']), getBlogPostById).put(protect, authorize(['admin']), updateBlogPost).delete(protect, authorize(['admin']), deleteBlogPost);
// router.get('/', protect, authorize(['admin']), getBlogs);
router.put('/:id/restore', protect, authorize(['admin']), require('../controllers/blogController').restoreBlogPost);
router.delete('/:id/permanent', protect, authorize(['admin']), deleteBlogPostPermanent);

export default router; 