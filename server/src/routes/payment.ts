import express from 'express';
import { createVnpayPaymentUrl, vnpayReturn } from '../controllers/paymentController';

const router = express.Router();

router.post('/vnpay_create', createVnpayPaymentUrl);
router.get('/vnpay_return', vnpayReturn);

export default router; 