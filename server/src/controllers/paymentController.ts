// controllers/paymentController.ts
import { Request, Response } from 'express';
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { vnpayConfig } from '../config/vnpay';
import { Order } from '../models/Order';

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
    if (!isNaN(orderId)) {
      try {
        await Order.updateStatus(orderId, 'processing');
      } catch (err) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', err);
      }
    }
    return res.redirect(`http://localhost:3000/payment-success?orderId=${orderId}`);
  } else {
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
