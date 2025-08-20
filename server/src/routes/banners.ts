import express from 'express';
import { getBanners, createBanner, updateBanner, softDeleteBanner, hardDeleteBanner, restoreBanner, getPublicBanners, getDeletedBanners } from '../controllers/bannerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getPublicBanners);

// Admin routes - specific routes first
router.route('/admin').get(protect, authorize(['admin']), getBanners).post(protect, authorize(['admin']), createBanner);
router.get('/admin/deleted', protect, authorize(['admin']), getDeletedBanners);
router.delete('/admin/:id/hard', protect, authorize(['admin']), hardDeleteBanner);
router.post('/admin/:id/restore', protect, authorize(['admin']), restoreBanner);
router.route('/admin/:id').put(protect, authorize(['admin']), updateBanner).delete(protect, authorize(['admin']), softDeleteBanner);

export default router; 