import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: any[];
  orderStatusDistribution: any;
  todayStats: {
    orders: number;
    revenue: number;
  };
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'delivered':
        return 'Đã giao';
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <span className="ml-4 text-gray-600 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Lỗi</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    link,
    subtitle
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    link?: string;
    subtitle?: string;
  }) => {
    const content = (
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    );

    if (link) {
      return (
        <Link to={link}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            {content}
          </motion.div>
        </Link>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-2">Tổng quan hệ thống bán hàng</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng đơn hàng"
            value={stats.totalOrders}
            icon={Icons.ShoppingCart}
            color="bg-blue-500"
            link="/admin/orders"
          />
          <StatCard
            title="Đơn hàng chờ xử lý"
            value={stats.pendingOrders}
            icon={Icons.Clock}
            color="bg-yellow-500"
            link="/admin/orders"
          />
          <StatCard
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            icon={Icons.Package}
            color="bg-green-500"
            link="/admin/products"
          />
          <StatCard
            title="Tổng doanh thu"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={Icons.DollarSign}
            color="bg-pink-500"
          />
        </div>

        {/* Today's Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hôm nay</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.todayStats.orders}</p>
                <p className="text-sm text-gray-600">Đơn hàng</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${stats.todayStats.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Doanh thu</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Khách hàng</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.totalUsers}</p>
                <p className="text-sm text-gray-600">Tổng khách hàng</p>
              </div>
              <Icons.Users className="text-purple-500" size={32} />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Icons.Plus className="text-blue-600" size={20} />
              <span className="text-blue-600 font-medium">Thêm sản phẩm</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Icons.ShoppingCart className="text-green-600" size={20} />
              <span className="text-green-600 font-medium">Xem đơn hàng</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Icons.Users className="text-purple-600" size={20} />
              <span className="text-purple-600 font-medium">Khách hàng</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Icons.BarChart3 className="text-orange-600" size={20} />
              <span className="text-orange-600 font-medium">Phân tích</span>
            </Link>
          </div>
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo tháng</h3>
            <div className="space-y-3">
              {stats.monthlyRevenue.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full" 
                        style={{ width: `${Math.min((item.amount / Math.max(...stats.monthlyRevenue.map((m: any) => m.amount))) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</h3>
            <div className="space-y-3">
              {stats.topProducts.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-pink-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.total_sold}</p>
                    <p className="text-xs text-gray-500">Đã bán</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-pink-600 hover:underline font-medium">Xem tất cả</Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-900 font-medium">Đơn hàng #{order.id}</div>
                    <div className="text-xs text-gray-500">{order.customer}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.total_amount}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Icons.ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 