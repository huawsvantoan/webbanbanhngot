import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', protect, authorize(['admin']), getAnalytics);

export default router; 