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

  useEffect(() => {
    const orderId = query.get('orderId');
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
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

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded p-8 text-center">
      <div className="text-green-600 text-2xl font-bold mb-4">✅ Thanh toán thành công!</div>
      <div className="mb-4">Cảm ơn bạn đã mua hàng tại Cake Shop!</div>
      <div className="text-left mb-4">
        <div><b>Mã đơn hàng:</b> {order.id}</div>
        <div><b>Trạng thái:</b> {order.status}</div>
        <div><b>Tổng tiền:</b> {order.total_amount.toLocaleString()} VND</div>
        <div><b>Người nhận:</b> {order.name}</div>
        <div><b>Địa chỉ giao hàng:</b> {order.shipping_address}</div>
        <div><b>Số điện thoại:</b> {order.phone}</div>
        <div><b>Ngày đặt:</b> {new Date(order.created_at).toLocaleString()}</div>
      </div>
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate('/orders')}
      >
        Xem lịch sử đơn hàng
      </button>
    </div>
  );
};

export default PaymentSuccess; 