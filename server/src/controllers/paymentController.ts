import { Request, Response } from 'express';
import qs from 'qs';
import crypto from 'crypto';
import { vnpayConfig } from '../config/vnpay';
import { Order } from '../models/Order';

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

// Lấy địa chỉ IP IPv4
function getClientIp(req: Request): string {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  if (typeof ip === 'string' && ip.includes('::ffff:')) {
    ip = ip.split(':').pop() || '127.0.0.1';
  } else if (ip === '::1') {
    ip = '127.0.0.1';
  }
  return ip.toString();
}

export const createVnpayPaymentUrl = (req: Request, res: Response) => {
  const orderId = Date.now().toString();
  const amount = 10000; // hoặc lấy từ req.body.amount
  const vnp_Params: { [key: string]: string } = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan don hang ' + orderId,
    vnp_OrderType: 'billpayment',
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, '').slice(0, 14),
    vnp_IpAddr: req.ip || '127.0.0.1',
  };
  const sortedParams: { [key: string]: string } = Object.keys(vnp_Params).sort().reduce((acc: { [key: string]: string }, key) => {
    acc[key] = vnp_Params[key];
    return acc;
  }, {});
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha256', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  sortedParams['vnp_SecureHash'] = signed;
  const paymentUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
  res.json({ paymentUrl });
};

export const vnpayReturn = (req: Request, res: Response) => {
  const vnp_Params: { [key: string]: string } = {};
  Object.keys(req.query).forEach(key => {
    const value = req.query[key];
    if (typeof value === 'string') {
      vnp_Params[key] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        vnp_Params[key] = value[0];
      } else {
        vnp_Params[key] = JSON.stringify(value[0]);
      }
    } else if (typeof value === 'object' && value !== null) {
      vnp_Params[key] = JSON.stringify(value);
    } else if (value !== undefined) {
      vnp_Params[key] = String(value);
    }
  });
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];
  const sortedParams: { [key: string]: string } = Object.keys(vnp_Params).sort().reduce((acc: { [key: string]: string }, key) => {
    acc[key] = vnp_Params[key];
    return acc;
  }, {});
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha256', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  if (secureHash === signed) {
    res.send('Thanh toán thành công!');
  } else {
    res.status(400).send('Sai chữ ký!');
  }
};
