import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  monthlyRevenue: any[];
  orderStatusDistribution: any;
  topProducts: any[];
  topCategories: any[];
  customerGrowth: any[];
  revenueByDay: any[];
}

const Analytics: React.FC = () => {
  const { isAdmin } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
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

  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Phân tích dữ liệu</h1>
          <p className="text-gray-600 mt-2">Thống kê chi tiết và biểu đồ phân tích</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Khoảng thời gian</h2>
            <div className="flex gap-2">
              {[
                { value: '7days', label: '7 ngày' },
                { value: '30days', label: '30 ngày' },
                { value: '3months', label: '3 tháng' },
                { value: '6months', label: '6 tháng' },
                { value: '1year', label: '1 năm' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range.value
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Doanh thu theo thời gian</h2>
          <div className="space-y-4">
            {data.monthlyRevenue.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-24">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((item.amount / Math.max(...data.monthlyRevenue.map((m: any) => m.amount))) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-24 text-right">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Phân bố trạng thái đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries(data.orderStatusDistribution).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}></div>
                    <span className="text-sm text-gray-600">{getStatusText(status)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 32 32">
                                     {Object.entries(data.orderStatusDistribution).map(([status, count]: [string, any], index: number) => {
                     const total = Object.values(data.orderStatusDistribution).reduce((a: any, b: any) => a + b, 0) as number;
                     const percentage = (count / total) * 100;
                    const radius = 14;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = circumference;
                    const strokeDashoffset = circumference - (percentage / 100) * circumference;
                    const colors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
                    
                    return (
                      <circle
                        key={status}
                        cx="16"
                        cy="16"
                        r={radius}
                        fill="none"
                        stroke={colors[index % colors.length]}
                        strokeWidth="2"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                          transformOrigin: 'center',
                          transform: `rotate(${index * 72}deg)`
                        }}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">Tổng</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Products and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm bán chạy nhất</h3>
            <div className="space-y-3">
              {data.topProducts.map((product: any, index: number) => (
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

          {/* Top Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục phổ biến</h3>
            <div className="space-y-3">
              {data.topCategories?.map((category: any, index: number) => (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.product_count} sản phẩm</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{category.total_sales}</p>
                    <p className="text-xs text-gray-500">Đã bán</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Icons.FolderOpen size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Chưa có dữ liệu danh mục</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Customer Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Tăng trưởng khách hàng</h2>
          <div className="space-y-4">
            {data.customerGrowth?.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-24">{item.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min((item.count / Math.max(...data.customerGrowth.map((m: any) => m.count))) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-24 text-right">
                  {item.count} khách hàng
                </span>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Icons.Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Chưa có dữ liệu tăng trưởng khách hàng</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics; 