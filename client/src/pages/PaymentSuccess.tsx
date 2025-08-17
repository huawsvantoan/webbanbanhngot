import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Icons } from '../components/icons';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusConfig = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Thanh toán thành công!',
          message: 'Cảm ơn bạn đã mua hàng tại Cake Shop!',
          icon: <Icons.CheckCircle className="w-16 h-16 text-green-500" />,
          bgColor: 'from-green-400 to-emerald-500',
          cardBg: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconBg: 'bg-green-100'
        };
      case 'failed':
        return {
          title: 'Thanh toán thất bại!',
          message: 'Thanh toán qua VNPay không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
          icon: <Icons.XCircle className="w-16 h-16 text-red-500" />,
          bgColor: 'from-red-400 to-pink-500',
          cardBg: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconBg: 'bg-red-100'
        };
      case 'error':
        return {
          title: 'Có lỗi xảy ra!',
          message: 'Đã có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng liên hệ hỗ trợ.',
          icon: <Icons.AlertCircle className="w-16 h-16 text-yellow-500" />,
          bgColor: 'from-yellow-400 to-orange-500',
          cardBg: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconBg: 'bg-yellow-100'
        };
      default:
        return {
          title: 'Thông tin đơn hàng',
          message: 'Đơn hàng của bạn đã được tạo.',
          icon: <Icons.Info className="w-16 h-16 text-blue-500" />,
          bgColor: 'from-blue-400 to-indigo-500',
          cardBg: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-200 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-4"
        >
          {/* Header with icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className={`w-24 h-24 ${statusConfig.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {statusConfig.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{statusConfig.title}</h1>
            <p className="text-gray-600 text-lg">{statusConfig.message}</p>
          </motion.div>

          {/* Order details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${statusConfig.cardBg} ${statusConfig.borderColor} border rounded-2xl p-6 mb-8`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Icons.Package className="w-5 h-5" />
                Chi tiết đơn hàng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-800">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Trạng thái:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? 'Chờ xác nhận' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'completed' ? 'Hoàn thành' : order.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Tổng tiền:</span>
                    <span className="font-bold text-xl text-pink-600">
                      {Number(order.total_amount).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Ngày đặt:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Người nhận:</span>
                    <span className="font-semibold text-gray-800">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Số điện thoại:</span>
                    <span className="font-semibold text-gray-800">{order.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Địa chỉ:</span>
                    <span className="font-semibold text-gray-800 text-right">{order.shipping_address}</span>
                  </div>
                  {order.payment_method && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Thanh toán:</span>
                      <span className="font-semibold text-gray-800">
                        {order.payment_method === 'vnpay' ? 'VNPay' :
                         order.payment_method === 'bank' ? 'Chuyển khoản' :
                         order.payment_method === 'cod' ? 'Tiền mặt' :
                         order.payment_method}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Icons.Package className="w-5 h-5 inline mr-2" />
              Xem lịch sử đơn hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <Icons.Home className="w-5 h-5 inline mr-2" />
              Về trang chủ
            </button>
          </motion.div>

          {/* Success animation for successful payments */}
          {paymentStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center"
            >
              <div className="flex justify-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.2 }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, delay: 0.4 }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Đơn hàng đã được xác nhận</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 