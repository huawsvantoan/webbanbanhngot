import api from './api';

export interface PaymentInfo {
  id: number;
  order_id: number;
  payment_method: string;
  transaction_id?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  vnpay_transaction_no?: string;
  refund_transaction_no?: string;
  refund_amount?: number;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface RefundRequest {
  orderId: number;
  reason?: string;
}

export interface RefundResponse {
  message: string;
  refundTransactionNo: string;
  refundAmount: number;
  reason: string;
}

export const paymentService = {
  // Lấy thông tin payment của đơn hàng
  getOrderPayment: async (orderId: number): Promise<PaymentInfo> => {
    const response = await api.get(`/payment/order/${orderId}`);
    return response.data;
  },

  // Hoàn tiền VNPAY
  refundVnpayPayment: async (data: RefundRequest): Promise<RefundResponse> => {
    const response = await api.post('/payment/vnpay/refund', data);
    return response.data;
  },

  // Tạo URL thanh toán VNPAY
  createVnpayPaymentUrl: async (data: {
    amount: number;
    orderId: string;
    orderInfo?: string;
    bankCode?: string;
  }): Promise<{ paymentUrl: string }> => {
    const response = await api.post('/payment/vnpay/create', data);
    return response.data;
  }
}; 