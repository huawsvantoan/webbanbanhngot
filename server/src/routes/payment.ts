// routes/paymentRoute.ts
import express from 'express';
import { createVnpayPaymentUrl, vnpayReturn, vnpayIpn } from '../controllers/paymentController';

const router = express.Router();

router.post('/vnpay_create', createVnpayPaymentUrl);
router.get('/vnpay_return', vnpayReturn);
router.get('/vnpay_ipn', vnpayIpn);

export default router;
