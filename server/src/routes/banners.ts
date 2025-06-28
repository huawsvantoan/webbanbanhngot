import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/banners').get(protect, authorize(['admin']), getBanners).post(protect, authorize(['admin']), createBanner);
router.route('/banners/:id').put(protect, authorize(['admin']), updateBanner).delete(protect, authorize(['admin']), deleteBanner);

export default router; 