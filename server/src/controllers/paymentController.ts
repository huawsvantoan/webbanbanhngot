// controllers/paymentController.ts
import { Request, Response } from 'express';
import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment-timezone';
import { vnpayConfig } from '../config/vnpay';

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

export const vnpayReturn = (req: Request, res: Response) => {
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
    res.send('✅ Thanh toán thành công!');
  } else {
    res.status(400).send('❌ Sai chữ ký!');
  }
};