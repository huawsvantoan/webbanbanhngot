import express from 'express';
import * as authController from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));
router.get('/profile', protect, asyncHandler(authController.getProfile));
router.put('/profile', protect, asyncHandler(authController.updateProfile));
router.put('/change-password', protect, asyncHandler(authController.changePassword));
router.get('/users', protect, authorize(['admin']), asyncHandler(authController.getAllUsers));
router.get('/users/:id', protect, authorize(['admin']), asyncHandler(authController.getUserById));
router.put('/users/:id', protect, authorize(['admin']), asyncHandler(authController.updateUserById));
router.delete('/users/:id', protect, authorize(['admin']), asyncHandler(authController.deleteUserById));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/reset-password', asyncHandler(authController.resetPassword));
router.post('/verify-reset-code', asyncHandler(authController.verifyResetCode));

export default router; 