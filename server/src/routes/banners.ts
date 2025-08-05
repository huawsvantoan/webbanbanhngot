import express from 'express';
import { getBanners, createBanner, updateBanner, softDeleteBanner, hardDeleteBanner, restoreBanner, getPublicBanners, getDeletedBanners } from '../controllers/bannerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/banners', getPublicBanners);

// Admin routes
router.route('/admin/banners').get(protect, authorize(['admin']), getBanners).post(protect, authorize(['admin']), createBanner);
router.get('/admin/banners/deleted', protect, authorize(['admin']), getDeletedBanners);
router.route('/admin/banners/:id').put(protect, authorize(['admin']), updateBanner).delete(protect, authorize(['admin']), softDeleteBanner);
router.delete('/admin/banners/:id/hard', protect, authorize(['admin']), hardDeleteBanner);
router.post('/admin/banners/:id/restore', protect, authorize(['admin']), restoreBanner);

export default router; 