import express from 'express';
import * as cartController from '../controllers/cartController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// All cart routes require authentication
router.use(protect as express.RequestHandler);

router.get('/', asyncHandler(cartController.getCart));
router.post('/', asyncHandler(cartController.addToCart));
router.put('/:productId', asyncHandler(cartController.updateCartItem));
router.delete('/:productId', asyncHandler(cartController.removeFromCart));
router.delete('/', asyncHandler(cartController.clearCart));
router.put('/items/:id', asyncHandler(cartController.updateCartItemById));
router.delete('/items/:id', asyncHandler(cartController.removeCartItemById));

export default router; 