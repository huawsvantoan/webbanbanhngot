import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Order {
  id: number;
  status: string;
  total_amount: number;
  shipping_address: string;
  phone: string;
  name: string;
  created_at: string;
  payment_method?: string;
  // Thêm các trường khác nếu cần
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentSuccess: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'error' | null>(null);

  useEffect(() => {
    const orderId = query.get('orderId');
    const status = query.get('status') as 'success' | 'failed' | 'error' | null;
    const code = query.get('code');
    const message = query.get('message');

    setPaymentStatus(status);

    if (!orderId) {
      if (message === 'invalid_order') {
        setError('Mã đơn hàng không hợp lệ.');
      } else {
        setError('Không tìm thấy mã đơn hàng.');
      }
      setLoading(false);
      return;
    }

    axios.get(`/api/orders/${orderId}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không tìm thấy thông tin đơn hàng.');
        setLoading(false);
      });
  }, [query]);

  if (loading) return <div className="p-8 text-center">Đang tải thông tin đơn hàng...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return null;

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: '✅ Thanh toán thành công!',
          message: 'Cảm ơn bạn đã mua hàng tại Cake Shop!',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          title: '❌ Thanh toán thất bại!',
          message: 'Thanh toán qua VNPay không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
          color: 'text-red-600'
        };
      case 'error':
        return {
          title: '⚠️ Có lỗi xảy ra!',
          message: 'Đã có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng liên hệ hỗ trợ.',
          color: 'text-yellow-600'
        };
      default:
        return {
          title: 'ℹ️ Thông tin đơn hàng',
          message: 'Đơn hàng của bạn đã được tạo.',
          color: 'text-blue-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8 text-center">
      <div className={`text-2xl font-bold mb-4 ${statusInfo.color}`}>
        {statusInfo.title}
      </div>
      <div className="mb-4">{statusInfo.message}</div>
      
      {order && (
        <div className="text-left mb-4 bg-gray-50 p-4 rounded">
          <div><b>Mã đơn hàng:</b> {order.id}</div>
          <div><b>Trạng thái:</b> {order.status}</div>
          <div><b>Tổng tiền:</b> {Number(order.total_amount).toLocaleString('vi-VN')} VND</div>
          <div><b>Người nhận:</b> {order.name}</div>
          <div><b>Địa chỉ giao hàng:</b> {order.shipping_address}</div>
          <div><b>Số điện thoại:</b> {order.phone}</div>
          <div><b>Ngày đặt:</b> {new Date(order.created_at).toLocaleString('vi-VN')}</div>
          {order.payment_method && (
            <div><b>Phương thức thanh toán:</b> {
              order.payment_method === 'vnpay' ? 'VNPay' :
              order.payment_method === 'bank' ? 'Chuyển khoản' :
              order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' :
              order.payment_method
            }</div>
          )}
        </div>
      )}
      
      <div className="flex gap-4 justify-center">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => navigate('/orders')}
        >
          Xem lịch sử đơn hàng
        </button>
        <button
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess; 