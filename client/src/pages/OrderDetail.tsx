import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Icons } from '../components/icons';
import orderService from '../services/orderService';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  shipping_address: string;
  shipping_phone: string;
  shipping_email: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  name?: string;
  note?: string;
  payment_method?: 'cod' | 'vnpay'; // Thêm trường này để nhận biết phương thức thanh toán
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelNote, setCancelNote] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
    // eslint-disable-next-line
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': 
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setCancelLoading(true);
    try {
      await orderService.updateOrderStatus(order.id!, 'cancelled', cancelNote);
      window.location.reload();
    } catch (err) {
      alert('Không thể hủy đơn hàng!');
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
      setCancelNote('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <Icons.ArrowLeft size={20} />
          Quay lại
        </button>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đơn hàng #{order.id}</h1>
          <p className="text-gray-600 mb-2">
            Đặt lúc {new Date(order.created_at).toLocaleTimeString('vi-VN')} ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </p>
          <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
            {order.status === 'pending' && 'Chờ xác nhận'}
            {order.status === 'processing' && 'Đang xử lý'}
            {order.status === 'shipped' && 'Đã giao cho đơn vị vận chuyển'}
            {order.status === 'delivered' && 'Đã giao hàng'}
            {order.status === 'cancelled' && 'Đã hủy'}
            {order.status === 'completed' && 'Hoàn thành'}
          </span>
          {/* Thông báo nếu đã thanh toán qua VNPAY */}
          {order.payment_method === 'vnpay' && (order.status === 'pending' || order.status === 'processing') && (
            <div className="mt-4 bg-yellow-100 text-yellow-800 p-3 rounded font-semibold">
              Đơn hàng đã được thanh toán qua <span className="font-bold">VNPAY</span>. Nếu bạn muốn hủy và hoàn tiền, vui lòng liên hệ bộ phận hỗ trợ khách hàng. Đơn hàng đã thanh toán không thể tự hủy trên hệ thống.
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm trong đơn</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.product_image || '/images/default-cake.jpg'}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{Number(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  <p className="text-sm text-gray-600">Tổng: {(Number(item.price) * item.quantity).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Icons.User className="text-gray-400" size={20} />
              <span className="font-medium text-gray-900">{order.name}</span>
            </div>
            {order.shipping_phone && (
              <div className="flex items-center gap-3">
                <Icons.Phone className="text-gray-400" size={20} />
                <span className="font-medium text-gray-900">{order.shipping_phone}</span>
              </div>
            )}
            {order.shipping_email && (
              <div className="flex items-center gap-3">
                <Icons.Mail className="text-gray-400" size={20} />
                <span className="font-medium text-gray-900">{order.shipping_email}</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Icons.MapPin className="text-gray-400 mt-1" size={20} />
              <span className="font-medium text-gray-900">{order.shipping_address}</span>
            </div>
            {order.note && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400" style={{fontSize: 20}}>📝</span>
                <span className="font-medium text-gray-900">{order.note}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-medium">{Number(order.total_amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-lg font-bold text-gray-900">{Number(order.total_amount).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Nút hủy đơn hàng */}
        {(order.status === 'pending' || order.status === 'processing') && order.payment_method !== 'vnpay' && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Hủy đơn hàng
          </button>
        )}
        {showCancelModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Xác nhận hủy đơn hàng</h2>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows={3}
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelNote}
                onChange={e => setCancelNote(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  disabled={cancelLoading}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  disabled={cancelLoading || !cancelNote.trim()}
                >
                  {cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 