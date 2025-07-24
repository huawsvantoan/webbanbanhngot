// controllers/paymentController.ts
import { Request, Response } from 'express';
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { vnpayConfig } from '../config/vnpay';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';

const encodeParams = (obj: Record<string, string>) => {
  const sorted: Record<string, string> = {};
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  });
  return sorted;
};

export const createVnpayPaymentUrl = (req: Request, res: Response): void => {
  let { amount, orderId, orderInfo, bankCode = 'NCB' } = req.body;

  if (typeof amount === 'string') {
    amount = amount.replace(/[^0-9]/g, '');
  }
  const vnp_Amount = (parseInt(amount, 10) * 100).toString();

  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo || 'Thanh toán đơn hàng',
    vnp_OrderType: 'billpayment',
    vnp_Amount,
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_CreateDate: moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'),
    vnp_IpAddr: req.headers['x-forwarded-for']?.toString() || '113.23.45.67',
    vnp_BankCode: bankCode,
  };

  const signData = qs.stringify(encodeParams(vnp_Params), { encode: false });
  const signed = crypto
    .createHmac('sha512', vnpayConfig.vnp_HashSecret)
    .update(signData)
    .digest('hex');

  vnp_Params.vnp_SecureHash = signed;

  const paymentUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(encodeParams(vnp_Params), { encode: false })}`;
  res.status(200).json({ paymentUrl });
};

export const vnpayReturn = async (req: Request, res: Response) => {
  const vnp_Params: Record<string, string> = {};
  Object.keys(req.query).forEach((key) => {
    const value = req.query[key];
    if (typeof value === 'string') {
      vnp_Params[key] = value;
    }
  });

  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const signData = qs.stringify(encodeParams(vnp_Params), { encode: false });
  const signed = crypto
    .createHmac('sha512', vnpayConfig.vnp_HashSecret)
    .update(signData)
    .digest('hex');

  if (secureHash === signed) {
    let orderIdStr = vnp_Params['vnp_TxnRef'];
    let orderId = NaN;
    if (orderIdStr) {
      if (orderIdStr.startsWith('ORDER_')) {
        orderId = parseInt(orderIdStr.replace('ORDER_', ''), 10);
      } else {
        orderId = parseInt(orderIdStr, 10);
      }
    }
    
    // Kiểm tra response code từ VNPay
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];
    const amount = parseInt(vnp_Params['vnp_Amount'], 10) / 100; // Chuyển về VND
    
    if (!isNaN(orderId)) {
      try {
        if (responseCode === '00') {
          // Thanh toán thành công - cập nhật payment record
          const payment = await Payment.findByOrderId(orderId);
          if (payment) {
            await Payment.updateStatus(payment.id, 'completed');
          } else {
            // Tạo payment record nếu chưa có
            await Payment.create({
              order_id: orderId,
              payment_method: 'vnpay',
              amount: amount,
              vnpay_transaction_no: transactionNo
            });
          }
          
          await Order.updateStatus(orderId, 'processing');
          console.log(`VNPay payment successful for order ${orderId}, transaction: ${transactionNo}`);
          return res.redirect(`http://localhost:3000/payment-success?orderId=${orderId}&status=success`);
        } else {
          // Thanh toán thất bại
          const payment = await Payment.findByOrderId(orderId);
          if (payment) {
            await Payment.updateStatus(payment.id, 'failed');
          }
          
          console.log(`VNPay payment failed for order ${orderId}, response code: ${responseCode}`);
          return res.redirect(`http://localhost:3000/payment-success?orderId=${orderId}&status=failed&code=${responseCode}`);
        }
      } catch (err) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', err);
        return res.redirect(`http://localhost:3000/payment-success?orderId=${orderId}&status=error`);
      }
    } else {
      console.error('Invalid order ID from VNPay:', orderIdStr);
      return res.redirect(`http://localhost:3000/payment-success?status=error&message=invalid_order`);
    }
  } else {
    console.error('VNPay signature verification failed');
    res.status(400).send('❌ Sai chữ ký!');
  }
};

export const vnpayIpn = async (req: Request, res: Response) => {
  const vnp_Params: Record<string, string> = {};
  Object.keys(req.query).forEach((key) => {
    const value = req.query[key];
    if (typeof value === 'string') {
      vnp_Params[key] = value;
    }
  });

  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const signData = qs.stringify(encodeParams(vnp_Params), { encode: false });
  const signed = crypto
    .createHmac('sha512', vnpayConfig.vnp_HashSecret)
    .update(signData)
    .digest('hex');

  if (secureHash === signed) {
    let orderIdStr = vnp_Params['vnp_TxnRef'];
    let orderId = NaN;
    if (orderIdStr) {
      if (orderIdStr.startsWith('ORDER_')) {
        orderId = parseInt(orderIdStr.replace('ORDER_', ''), 10);
      } else {
        orderId = parseInt(orderIdStr, 10);
      }
    }
    if (!isNaN(orderId) && vnp_Params['vnp_ResponseCode'] === '00') {
      try {
        await Order.updateStatus(orderId, 'processing');
      } catch (err) {
        console.error('Lỗi cập nhật trạng thái đơn hàng (IPN):', err);
        return res.json({ RspCode: '99', Message: 'Update order failed' });
      }
      return res.json({ RspCode: '00', Message: 'Success' });
    } else {
      return res.json({ RspCode: '01', Message: 'Order not found or not successful' });
    }
  } else {
    return res.json({ RspCode: '97', Message: 'Invalid signature' });
  }
};

// API hoàn tiền VNPAY
export const refundVnpayPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, reason = 'Order cancelled' } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Kiểm tra đơn hàng
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Kiểm tra payment record
    const payment = await Payment.findByOrderId(orderId);
    if (!payment || payment.payment_method !== 'vnpay') {
      return res.status(400).json({ message: 'No VNPAY payment found for this order' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Payment not completed, cannot refund' });
    }

    // Tạo request hoàn tiền VNPAY
    const refundParams: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'refund',
      vnp_TmnCode: vnpayConfig.vnp_TmnCode,
      vnp_TxnRef: `ORDER_${orderId}`,
      vnp_TransactionType: '03', // Refund
      vnp_Amount: (payment.amount * 100).toString(), // Chuyển về số tiền VNPAY (x100)
      vnp_OrderInfo: `Hoan tien don hang ${orderId}`,
      vnp_TransactionNo: payment.vnpay_transaction_no || '',
      vnp_CreateDate: moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss'),
      vnp_IpAddr: req.headers['x-forwarded-for']?.toString() || '113.23.45.67',
    };

    const signData = qs.stringify(encodeParams(refundParams), { encode: false });
    const signed = crypto
      .createHmac('sha512', vnpayConfig.vnp_HashSecret)
      .update(signData)
      .digest('hex');

    refundParams.vnp_SecureHash = signed;

    // Gọi API hoàn tiền VNPAY (sandbox)
    const refundUrl = 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction';
    
    // Trong thực tế, bạn cần gọi API VNPAY để hoàn tiền
    // Đây là mô phỏng thành công
    const mockRefundTransactionNo = `REFUND_${Date.now()}`;
    
    // Cập nhật payment record
    await Payment.updateRefund(
      payment.id,
      mockRefundTransactionNo,
      payment.amount,
      reason
    );

    // Cập nhật trạng thái đơn hàng
    await Order.updateStatus(orderId, 'cancelled', reason);

    console.log(`VNPAY refund successful for order ${orderId}, refund transaction: ${mockRefundTransactionNo}`);
    
    return res.status(200).json({
      message: 'Refund successful',
      refundTransactionNo: mockRefundTransactionNo,
      refundAmount: payment.amount,
      reason: reason
    });

  } catch (error) {
    console.error('Error processing VNPAY refund:', error);
    return res.status(500).json({ message: 'Error processing refund' });
  }
};

// API lấy thông tin payment của đơn hàng
export const getOrderPayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findByOrderId(parseInt(orderId));
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    return res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({ message: 'Error fetching payment' });
  }
};
