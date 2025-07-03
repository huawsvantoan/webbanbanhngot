import { Request, Response } from 'express';
import qs from 'qs';
import crypto from 'crypto';
import { vnpayConfig } from '../config/vnpay';

function removeVietnameseTones(str: string) {
  return str.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

export const createVnpayPaymentUrl = (req: Request, res: Response) => {
  let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (typeof ipAddr === 'string' && (ipAddr === '::1' || ipAddr === '::ffff:127.0.0.1')) {
    ipAddr = '127.0.0.1';
  }
  const tmnCode = vnpayConfig.vnp_TmnCode;
  const secretKey = vnpayConfig.vnp_HashSecret;
  const vnpUrl = vnpayConfig.vnp_Url;
  const returnUrl = vnpayConfig.vnp_ReturnUrl;

  let { amount, orderId, orderInfo } = req.body;
  // Nếu client không truyền orderId/orderInfo thì fallback
  orderId = orderId || Date.now().toString();
  // Loại bỏ dấu tiếng Việt trong orderInfo để tránh lỗi chữ ký
  orderInfo = orderInfo ? removeVietnameseTones(orderInfo) : 'Thanh toan don hang Cake Shop';
  const createDate = new Date();
  const pad = (n: number) => n < 10 ? '0' + n : n;
  const vnp_CreateDate =
    createDate.getFullYear().toString() +
    pad(createDate.getMonth() + 1) +
    pad(createDate.getDate()) +
    pad(createDate.getHours()) +
    pad(createDate.getMinutes()) +
    pad(createDate.getSeconds());

  const vnp_Params: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Amount: Math.round(Number(amount) * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate,
  };

  // Sắp xếp params theo thứ tự a-z
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  sortedParams['vnp_SecureHash'] = signed;

  const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: true })}`;

  // Thêm log debug chi tiết
  console.log('==== VNPay Debug ====');
  console.log('vnp_Params:', vnp_Params);
  console.log('sortedParams:', sortedParams);
  console.log('signData:', signData);
  console.log('signed:', signed);
  console.log('paymentUrl:', paymentUrl);
  console.log('====================');

  return res.json({ paymentUrl });
};

export const vnpayReturn = (req: Request, res: Response) => {
  // Log toàn bộ query gốc
  console.log('VNPay Return Raw Query:', req.query);
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp params theo thứ tự a-z
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(signData, 'utf-8').digest('hex');

  // Log để debug callback
  console.log('VNPay Return Params:', vnp_Params);
  console.log('SignData for return:', signData);
  console.log('Signed for return:', signed);
  console.log('SecureHash from VNPay:', secureHash);

  if (secureHash === signed) {
    // TODO: Cập nhật trạng thái đơn hàng trong DB nếu cần
    return res.send('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
  } else {
    // Trả về JSON debug để dễ kiểm tra
    return res.status(400).json({
      message: 'Xác thực không hợp lệ!',
      vnp_Params,
      signData,
      signed,
      secureHash_from_vnpay: secureHash
    });
  }
}; 