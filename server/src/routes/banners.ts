import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/banners', getBanners);
router.route('/banners').post(protect, authorize(['admin']), createBanner);
router.route('/banners/:id').put(protect, authorize(['admin']), updateBanner).delete(protect, authorize(['admin']), deleteBanner);

export default router; 