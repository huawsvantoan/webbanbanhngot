import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/dashboard').get(protect, authorize(['admin']), getDashboardStats);

export default router; 