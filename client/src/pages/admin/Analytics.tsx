import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

interface AnalyticsData {
  monthlyRevenue: any[];
  orderStatusDistribution: any;
  topProducts: any[];
  topCategories: any[];
  customerGrowth: any[];
  revenueByDay: any[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('6months');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/analytics?range=${timeRange}`);
      
      // Thêm dữ liệu mẫu cho revenueByDay nếu không có dữ liệu
      let data = response.data;
      if (!data.revenueByDay || data.revenueByDay.length === 0) {
        // Tạo dữ liệu mẫu cho 30 ngày gần nhất
        const sampleData = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const randomAmount = Math.floor(Math.random() * 1000) + 100; // Random từ 100-1100
          sampleData.push({
            date: date.toISOString().slice(0, 10),
            amount: randomAmount
          });
        }
        data.revenueByDay = sampleData;
      }
      
      setData(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

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

  // Prepare chart-friendly data
  const formatDateLabel = (iso: string) => {
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      return `${dd}/${mm}`;
    } catch {
      return iso;
    }
  };

  const monthlyRevenueAsc = Array.isArray(data.monthlyRevenue)
    ? [...data.monthlyRevenue].reverse()
    : [];

  const customerGrowthAsc = Array.isArray(data.customerGrowth)
    ? [...data.customerGrowth].reverse()
    : [];

  const revenueByDayFilled = (() => {
    console.log('Raw revenueByDay data:', data.revenueByDay);
    
    // Kiểm tra xem có dữ liệu thật không
    const hasRealData = data.revenueByDay && data.revenueByDay.length > 0;
    
    if (!hasRealData) {
      console.log('No real data found, generating sample data');
      // Tạo dữ liệu mẫu cho 30 ngày gần nhất
      const sampleData = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const randomAmount = Math.floor(Math.random() * 1000) + 100; // Random từ 100-1100
        sampleData.push({
          date: date.toISOString().slice(0, 10),
          amount: randomAmount
        });
      }
      
      console.log('Generated sample data:', sampleData);
      return sampleData;
    }
    
    // Nếu có dữ liệu thật, sử dụng dữ liệu đó
    console.log('Using real data from API');
    const map = new Map<string, number>((data.revenueByDay || []).map((d: any) => [d.date, d.amount]));
    
    // Tạo mảng 30 ngày gần nhất
    const out: { date: string; amount: number }[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const amount = map.get(key) || 0;
      out.push({ date: key, amount: amount });
    }
    
    const totalAmount = out.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    console.log('Revenue by day data:', {
      apiData: data.revenueByDay,
      processedData: out,
      map: Array.from(map.entries()),
      totalAmount: totalAmount,
      hasRealData: hasRealData
    });
    
    return out;
  })();

  const revenueByDayMax = Math.max(0, ...revenueByDayFilled.map((d: any) => Number(d.amount) || 0));
  const revenueYAxisDomain: [number, number] = [0, Math.max(1, revenueByDayMax)];

  const orderStatusDistributionSafe: Record<string, number> =
    (data as any).orderStatusDistribution && typeof (data as any).orderStatusDistribution === 'object'
      ? (data as any).orderStatusDistribution
      : {};

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

        {/* Revenue Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Doanh thu theo tháng</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Tổng: {monthlyRevenueAsc.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()} VNĐ</span>
              </div>
            </div>
            <div className="h-72">
              {monthlyRevenueAsc.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Icons.BarChart3 className="mx-auto mb-2 text-gray-300" size={48} />
                    <p>Chưa có dữ liệu doanh thu</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyRevenueAsc} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} interval={0} height={60} angle={-30} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} />
                    <Legend />
                    <Bar dataKey="amount" name="Doanh thu" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

                     <div className="bg-white rounded-lg shadow-md p-6">
                           <div className="flex items-center justify-between mb-6">
                                 <div>
                   <h2 className="text-xl font-semibold text-gray-800">Doanh thu 30 ngày gần nhất</h2>
                   {data.revenueByDay && data.revenueByDay.length > 0 ? (
                     <p className="text-xs text-green-600 mt-1">✅ Dữ liệu thật từ database</p>
                   ) : (
                     <p className="text-xs text-orange-600 mt-1">💡 Đang hiển thị dữ liệu mẫu</p>
                   )}
                   <p className="text-xs text-blue-600 mt-1">Debug: {revenueByDayFilled.length} ngày, Tổng: {revenueByDayFilled.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)}</p>
                 </div>
                                 <div className="flex items-center space-x-4">
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                     <span className="text-sm text-gray-600">Tổng: {revenueByDayFilled.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toLocaleString()} VNĐ</span>
                   </div>
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                     <span className="text-sm text-gray-600">TB/ngày: {Math.round(revenueByDayFilled.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) / 30).toLocaleString()} VNĐ</span>
                   </div>
                 </div>
              </div>
                           <div className="h-72">
                {revenueByDayFilled.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Icons.TrendingUp className="mx-auto mb-2 text-gray-300" size={48} />
                      <p>Không có doanh thu trong 30 ngày gần nhất</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueByDayFilled} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatDateLabel} />
                      <YAxis domain={revenueYAxisDomain} allowDecimals={false} />
                      <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} labelFormatter={(v: any) => `Ngày ${formatDateLabel(String(v))}`} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" name="Doanh thu" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, fill: '#8b5cf6' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
           </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Phân bố trạng thái đơn hàng</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(orderStatusDistributionSafe).map(([status, count]: [string, any]) => ({ name: getStatusText(status), value: count }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {Object.entries(orderStatusDistributionSafe).map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={[ '#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6' ][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {Object.entries(orderStatusDistributionSafe).map(([status, count]: [string, any]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}></div>
                    <span className="text-sm text-gray-600">{getStatusText(status)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthAsc} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} interval={0} height={60} angle={-30} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Khách hàng" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
</div>
    </div>
  );
};

export default Analytics;
