import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

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
  user_name: string;
  user_email: string;
  name?: string;
  phone?: string;
  note?: string;
  payment_method: string;
  payment_proof?: string | null;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/${orderId}`);
      setOrder(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (!order) return;

    try {
      setUpdating(true);
      await api.put(`/admin/orders/${order.id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Icons.Clock className="text-yellow-500" size={20} />;
      case 'processing': return <Icons.Package className="text-blue-500" size={20} />;
      case 'shipped': return <Icons.Truck className="text-purple-500" size={20} />;
      case 'delivered': 
      case 'completed': return <Icons.CheckCircle className="text-green-500" size={20} />;
      case 'cancelled': return <Icons.AlertCircle className="text-red-500" size={20} />;
      default: return <Icons.Clock className="text-gray-500" size={20} />;
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

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    return steps.indexOf(status) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  // Debug: log giá trị payment_proof để kiểm tra
  if (order) {
    // eslint-disable-next-line no-console
    console.log('DEBUG payment_proof:', order.payment_proof);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Icons.ArrowLeft size={20} />
              Quay lại danh sách đơn
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Đơn hàng #{order.id}</h1>
              <p className="text-gray-600 mt-2">
                Đặt lúc {new Date(order.created_at).toLocaleTimeString('vi-VN')} ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {order.status === 'pending' && 'Chờ xác nhận'}
                {order.status === 'processing' && 'Đang xử lý'}
                {order.status === 'shipped' && 'Đã giao cho đơn vị vận chuyển'}
                {order.status === 'delivered' && 'Đã giao hàng'}
                {order.status === 'cancelled' && 'Đã hủy'}
                {order.status === 'completed' && 'Hoàn thành'}
              </span>
            </div>
          </div>
        </motion.div>

        {order.status === 'cancelled' && order.note && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-red-400" style={{fontSize: 24}}>📝</span>
              <div>
                <p className="font-semibold text-red-700">Lý do hủy đơn:</p>
                <p className="text-red-700">{order.note}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Tiến trình đơn hàng</h2>
              <div className="space-y-4">
                {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                  const isCompleted = getStatusStep(order.status) > index;
                  const isCurrent = getStatusStep(order.status) === index + 1;
                  
                  return (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {isCompleted ? (
                          <Icons.CheckCircle className="text-white" size={16} />
                        ) : (
                          <span className="text-white text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step === 'pending' && 'Chờ xác nhận'}
                          {step === 'processing' && 'Đang xử lý'}
                          {step === 'shipped' && 'Đã giao cho đơn vị vận chuyển'}
                          {step === 'delivered' && 'Đã giao hàng'}
                        </p>
                        {isCurrent && (
                          <p className="text-sm text-gray-600">Đang ở bước này</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Sản phẩm trong đơn</h2>
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
                      <p className="font-medium text-gray-900">${Number(item.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Tổng: {(Number(item.price) * item.quantity).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Customer Info & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin khách hàng</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icons.User className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">{order.name || order.user_name}</p>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                  </div>
                </div>
                {(order.shipping_phone || order.phone) && (
                  <div className="flex items-center gap-3">
                    <Icons.Phone className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{order.shipping_phone || order.phone}</p>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                    </div>
                  </div>
                )}
                {order.shipping_email && (
                  <div className="flex items-center gap-3">
                    <Icons.Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">{order.shipping_email}</p>
                      <p className="text-sm text-gray-600">Email</p>
                    </div>
                  </div>
                )}
                {order.note && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400" style={{fontSize: 20}}>📝</span>
                    <div>
                      <p className="font-medium text-gray-900">{order.note}</p>
                      <p className="text-sm text-gray-600">Ghi chú</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Icons.MapPin className="text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Địa chỉ giao hàng</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Cập nhật trạng thái</h2>
              <div className="space-y-3">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status as Order['status'])}
                    disabled={updating || order.status === status}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      order.status === status
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {getStatusIcon(status)}
                    <span className="capitalize">
                      {status === 'pending' && 'Chờ xác nhận'}
                      {status === 'processing' && 'Đang xử lý'}
                      {status === 'shipped' && 'Đã giao cho đơn vị vận chuyển'}
                      {status === 'delivered' && 'Đã giao hàng'}
                      {status === 'cancelled' && 'Đã hủy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin thanh toán</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">
                    {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                  </span>
                </div>
                {order.payment_method === 'bank' && order.payment_proof && (
                  <div>
                    <span className="text-gray-600">Ảnh xác nhận chuyển khoản:</span>
                    <img
                      src={order.payment_proof}
                      alt="Payment proof"
                      className="mt-2 mb-2 rounded border-2 border-pink-400 w-40"
                      style={{ display: 'block' }}
                    />
                  </div>
                )}
                {order.payment_method === 'bank' && (
                  <div className="text-green-600 font-medium mt-2">
                    Khách đã chuyển khoản trước số tiền này.
                  </div>
                )}
                {order.payment_method === 'cod' && (
                  <div className="text-yellow-600 font-medium mt-2">
                    Khách sẽ thanh toán khi nhận hàng (COD).
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">${Number(order.total_amount).toFixed(2)}</span>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 