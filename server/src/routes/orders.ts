import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../controllers/productController';

const router = Router();

// User-specific order routes (require authentication)
router.post('/', protect, upload.single('payment_proof'), orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', protect, orderController.updateOrderStatus);

export default router; 