import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: { month: string; amount: number }[];
    daily: { date: string; amount: number }[];
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    monthly: { month: string; count: number }[];
    daily: { date: string; count: number }[];
    growth: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
    active: number;
    growth: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
    topSelling: { id: number; name: string; sales: number; revenue: number }[];
  };
  categories: {
    name: string;
    count: number;
    revenue: number;
  }[];
}

const Analytics: React.FC = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?range=${timeRange}`);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: string | number;
    change: number;
    icon: any;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {change >= 0 ? (
              <Icons.TrendingUp className="text-green-500" size={16} />
            ) : (
              <Icons.TrendingDown className="text-red-500" size={16} />
            )}
            <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% so với kỳ trước
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );

  const SimpleChart = ({ 
    data, 
    title, 
    color = 'bg-blue-500',
    valueKey = 'amount'
  }: {
    data: { month?: string; date?: string; amount?: number; count?: number }[];
    title: string;
    color?: string;
    valueKey?: 'amount' | 'count';
  }) => {
    const maxValue = Math.max(...data.map(d => d[valueKey] || 0));
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {data.map((item, index) => {
            const value = item[valueKey] || 0;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const label = item.month ? item.month.slice(0, 3) : 
                         item.date ? new Date(item.date).getDate().toString() : '';
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${color} rounded-t transition-all duration-300`}
                  style={{ height: `${height}%` }}
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Lỗi</h2>
          <p className="text-gray-600 text-center">{error || 'Không thể tải dữ liệu thống kê'}</p>
        </div>
      </div>
    );
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Thống kê & Phân tích</h1>
              <p className="text-gray-600 mt-2">Theo dõi hiệu suất kinh doanh và thông tin chi tiết</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Icons.Filter className="text-gray-400" size={20} />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="7d">7 ngày qua</option>
                  <option value="30d">30 ngày qua</option>
                  <option value="90d">90 ngày qua</option>
                  <option value="1y">1 năm qua</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(data.revenue.total)}
            change={data.revenue.growth}
            icon={Icons.DollarSign}
            color="bg-pink-500"
          />
          <StatCard
            title="Tổng đơn hàng"
            value={formatNumber(data.orders.total)}
            change={data.orders.growth}
            icon={Icons.ShoppingCart}
            color="bg-blue-500"
          />
          <StatCard
            title="Khách hàng mới"
            value={formatNumber(data.customers.newThisMonth)}
            change={data.customers.growth}
            icon={Icons.Users}
            color="bg-green-500"
          />
          <StatCard
            title="Sản phẩm"
            value={formatNumber(data.products.total)}
            change={0}
            icon={Icons.Package}
            color="bg-purple-500"
          />
        </div>

        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.orders.pending}</p>
              <p className="text-sm text-gray-600">Chờ xử lý</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{data.orders.completed}</p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{data.orders.cancelled}</p>
              <p className="text-sm text-gray-600">Đã hủy</p>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SimpleChart
            data={data.revenue.monthly}
            title="Doanh thu theo tháng"
            color="bg-pink-500"
            valueKey="amount"
          />
          <SimpleChart
            data={data.orders.monthly}
            title="Đơn hàng theo tháng"
            color="bg-blue-500"
            valueKey="count"
          />
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-4">
            {data.products.topSelling.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">Đã bán: {product.sales}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Hiệu suất danh mục</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.categories.map((category, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Sản phẩm: {category.count}</p>
                  <p className="text-sm text-gray-600">Doanh thu: {formatCurrency(category.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 