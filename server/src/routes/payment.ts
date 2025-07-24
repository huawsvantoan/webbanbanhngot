// routes/paymentRoute.ts
import express from 'express';
import { createVnpayPaymentUrl, vnpayReturn, vnpayIpn, refundVnpayPayment, getOrderPayment } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Tạo URL thanh toán VNPAY
router.post('/vnpay/create', protect, createVnpayPaymentUrl);

// Callback từ VNPAY
router.get('/vnpay_return', vnpayReturn);

// IPN từ VNPAY
router.get('/vnpay_ipn', vnpayIpn);

// Hoàn tiền VNPAY
router.post('/vnpay/refund', protect, refundVnpayPayment);

// Lấy thông tin payment của đơn hàng
router.get('/order/:orderId', protect, getOrderPayment);

export default router;
