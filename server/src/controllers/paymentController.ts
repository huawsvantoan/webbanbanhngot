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
  // Tạo orderId duy nhất
  const orderId = Date.now().toString();
  const amount = 10000; // 10,000 VND
  const orderInfo = 'Thanh toan don hang ' + orderId;
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
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'billpayment',
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_CreateDate: vnp_CreateDate,
    vnp_IpAddr: getClientIp(req),
  };

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = vnp_Params[key].toString();
      return acc;
    }, {});

  const signData = require('qs').stringify(sortedParams, { encode: false });
  const hmac = require('crypto').createHmac('sha256', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(signData, 'utf-8').digest('hex');
  sortedParams['vnp_SecureHash'] = signed;

  const paymentUrl = `${vnpayConfig.vnp_Url}?${require('qs').stringify(sortedParams, { encode: true })}`;

  // Log debug
  console.log('==== VNPay Debug ====');
  console.log('vnp_Params:', vnp_Params);
  console.log('sortedParams:', sortedParams);
  console.log('signData:', signData);
  console.log('signed:', signed);
  console.log('paymentUrl:', paymentUrl);
  console.log('====================');

  return res.json({ paymentUrl });
};

export const vnpayReturn = async (req: Request, res: Response) => {
  console.log('VNPay Return Raw Query:', req.query);
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];

  if (!secureHash) {
    console.log('Thiếu vnp_SecureHash từ VNPay');
    return res.status(400).send('Thiếu chữ ký từ VNPay');
  }

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc: any, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha256', vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(signData, 'utf-8').digest('hex');

  console.log('VNPay Return Params:', vnp_Params);
  console.log('SignData for return:', signData);
  console.log('Signed for return:', signed);
  console.log('SecureHash from VNPay:', secureHash);

  if (secureHash === signed) {
    const orderId = Number(vnp_Params['vnp_TxnRef']);
    if (!isNaN(orderId)) {
      try {
        const updated = await Order.updateStatus(orderId, 'completed');
        if (updated) {
          return res.send('✅ Thanh toán thành công! Đơn hàng đã được xác nhận.');
        } else {
          return res.status(404).send('Thanh toán thành công nhưng không tìm thấy đơn hàng.');
        }
      } catch (err) {
        console.error('❌ Lỗi cập nhật đơn hàng:', err);
        return res.status(500).send('Thanh toán thành công nhưng cập nhật đơn hàng thất bại.');
      }
    } else {
      return res.status(400).send('Thiếu hoặc sai mã đơn hàng.');
    }
  } else {
    return res.status(400).json({
      message: '❌ Xác thực không hợp lệ!',
      vnp_Params,
      signData,
      signed,
      secureHash_from_vnpay: secureHash,
    });
  }
};
