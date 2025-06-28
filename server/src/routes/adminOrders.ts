import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Admin order routes (require authentication and admin role)
router.route('/orders').get(protect, authorize(['admin']), orderController.getAllOrders);
router.route('/orders/:id/status').put(protect, authorize(['admin']), orderController.updateOrderStatus);
router.route('/orders/:id').get(protect, authorize(['admin']), orderController.getOrderById);

export default router; 