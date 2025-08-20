import { Router } from 'express';
import { getAnalyticsData } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', protect, authorize(['admin']), getAnalyticsData);

export default router; 