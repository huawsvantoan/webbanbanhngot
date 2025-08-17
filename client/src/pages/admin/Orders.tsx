import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { orderSchema, OrderFormData } from '../../validations/orderSchema';

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  items_count: number;
  shipping_address: string;
  payment_method?: string;
  payment_proof?: string | null;
}

const AdminOrders: React.FC = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'all' | Order['status']>('all');
  const [selectedPayment, setSelectedPayment] = useState<'all' | 'cod' | 'vnpay' | 'cash' | 'transfer'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders');
      setOrders(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, status: Order['status']) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success(`Order #${orderId} status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    let matchesPayment = true;
    if (selectedPayment === 'cod') matchesPayment = order.payment_method === 'cod';
    if (selectedPayment === 'vnpay') matchesPayment = order.payment_method === 'vnpay';
    if (selectedPayment === 'cash') matchesPayment = order.payment_method === 'cash';
    if (selectedPayment === 'transfer') matchesPayment = order.payment_method === 'transfer';
    return matchesStatus && matchesPayment;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return Icons.Clock;
      case 'processing': return Icons.Loader;
      case 'shipped': return Icons.Truck;
      case 'delivered': return Icons.CheckCircle;
      case 'completed': return Icons.CheckCircle;
      case 'cancelled': return Icons.XCircle;
      default: return Icons.Clock;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Create Order Modal Component
  const CreateOrderModal = () => {
    // Form data state
    const [formData, setFormData] = useState<OrderFormData>({
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      payment_method: 'cash',
      products: [],
      total_amount: 0
    });

    // Validation states
    const [errors, setErrors] = useState<Partial<OrderFormData>>({});
    const [touched, setTouched] = useState<Partial<OrderFormData>>({});

    const [selectedProducts, setSelectedProducts] = useState<Array<{
      product_id: number | null;
      name: string;
      price: number;
      quantity: number;
    }>>([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Array<{
      id: number;
      name: string;
      price: number;
      stock: number;
    }>>([]);

    useEffect(() => {
      fetchProducts();
    }, []);

    // Validation functions
    const validateField = async (field: keyof OrderFormData, value: any) => {
      try {
        await orderSchema.validateAt(field, { ...formData, [field]: value });
        setErrors(prev => ({ ...prev, [field]: undefined }));
      } catch (err: any) {
        setErrors(prev => ({ ...prev, [field]: err.message }));
      }
    };

    const handleChange = (field: keyof OrderFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Validate ngay khi user nhập liệu
      validateField(field, value);
    };

    const handleBlur = (field: keyof OrderFormData) => {
      setTouched(prev => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    };

    const validateForm = async () => {
      try {
        await orderSchema.validate(formData, { abortEarly: false });
        setErrors({});
        return true;
      } catch (err: any) {
        const validationErrors: Partial<OrderFormData> = {};
        err.inner.forEach((error: any) => {
          validationErrors[error.path as keyof OrderFormData] = error.message;
        });
        setErrors(validationErrors);
        return false;
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?limit=1000'); // Lấy tất cả sản phẩm
        // API bây giờ trả về { data: [...], total, totalPages, ... }
        setProducts(response.data.data || response.data);
      } catch (error) {
        toast.error('Không thể tải danh sách sản phẩm');
      }
    };

    const addProduct = () => {
      if (selectedProducts.length < 10) {
        const newProduct = {
          product_id: null,
          name: '',
          price: 0,
          quantity: 1
        };
        setSelectedProducts([...selectedProducts, newProduct]);
        
        // Update formData products
        const updatedProducts = [...selectedProducts, newProduct];
        setFormData(prev => ({ 
          ...prev, 
          products: updatedProducts,
          total_amount: updatedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }));
      }
    };

    const removeProduct = (index: number) => {
      const updatedProducts = selectedProducts.filter((_, i) => i !== index);
      setSelectedProducts(updatedProducts);
      
      // Update formData products
      setFormData(prev => ({ 
        ...prev, 
        products: updatedProducts,
        total_amount: updatedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }));
    };

    const updateProduct = (index: number, field: string, value: any) => {
      const updated = [...selectedProducts];
      if (field === 'product_id') {
        const product = products.find(p => p.id === value);
        if (product) {
          updated[index] = {
            ...updated[index],
            product_id: value,
            name: product.name,
            price: product.price
          };
        }
      } else if (field === 'quantity' || field === 'price') {
        // Xử lý NaN cho số
        const numValue = parseInt(value) || 0;
        updated[index] = { ...updated[index], [field]: numValue };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      setSelectedProducts(updated);
      
      // Update formData products
      setFormData(prev => ({ 
        ...prev, 
        products: updated,
        total_amount: updated.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }));

      // Validate products sau khi update
      validateField('products', updated);
    };



    const handleSubmit = async () => {
      console.log('Current selected products:', selectedProducts); // Debug log
      
      // Validate form
      const isValid = await validateForm();
      if (!isValid) {
        toast.error('Vui lòng kiểm tra lại thông tin');
        return;
      }

      setLoading(true);
      try {
        const orderData = {
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_address: formData.customer_address,
          products: selectedProducts,
          payment_method: formData.payment_method,
          total_amount: formData.total_amount
        };

        console.log('Sending order data:', orderData); // Debug log

        const response = await api.post('/admin/orders/create-direct', orderData);
        console.log('Order created successfully:', response.data); // Debug log
        
        toast.success('Tạo đơn hàng thành công!');
        setShowCreateModal(false);
        
        // Reset form
        setFormData({
          customer_name: '',
          customer_phone: '',
          customer_address: '',
          payment_method: 'cash',
          products: [],
          total_amount: 0
        });
        setSelectedProducts([]);
        setErrors({});
        setTouched({});
        
        fetchOrders(); // Refresh orders list
      } catch (error: any) {
        console.error('Error creating order:', error); // Debug log
        toast.error(error.response?.data?.message || 'Không thể tạo đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tạo đơn hàng mới</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Icons.X size={24} />
            </button>
          </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Tên khách hàng *
               </label>
               <input
                 type="text"
                 value={formData.customer_name}
                 onChange={(e) => handleChange('customer_name', e.target.value)}
                 onBlur={() => handleBlur('customer_name')}
                                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.customer_name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                }`}
                placeholder="Nhập tên khách hàng"
              />
              {errors.customer_name && (
                <p className="mt-1 text-sm text-red-600">{errors.customer_name}</p>
              )}
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Số điện thoại *
               </label>
               <input
                 type="tel"
                 value={formData.customer_phone}
                 onChange={(e) => handleChange('customer_phone', e.target.value)}
                 onBlur={() => handleBlur('customer_phone')}
                                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.customer_phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                }`}
                placeholder="Nhập số điện thoại"
              />
              {errors.customer_phone && (
                <p className="mt-1 text-sm text-red-600">{errors.customer_phone}</p>
              )}
             </div>
             <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Địa chỉ
               </label>
               <input
                 type="text"
                 value={formData.customer_address}
                 onChange={(e) => handleChange('customer_address', e.target.value)}
                 onBlur={() => handleBlur('customer_address')}
                                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.customer_address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                }`}
                placeholder="Nhập địa chỉ (tùy chọn)"
              />
              {errors.customer_address && (
                <p className="mt-1 text-sm text-red-600">{errors.customer_address}</p>
              )}
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Phương thức thanh toán
               </label>
               <select
                 value={formData.payment_method}
                 onChange={(e) => handleChange('payment_method', e.target.value)}
                 onBlur={() => handleBlur('payment_method')}
                                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.payment_method
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-pink-500'
                }`}
               >
                 <option value="cash">Tiền mặt (Thanh toán ngay)</option>
                 <option value="transfer">Chuyển khoản</option>
               </select>
              
                             {/* Hiển thị thông tin bổ sung cho từng phương thức */}
               <div className="mt-2 text-sm text-gray-600">
                 {formData.payment_method === 'cash' && (
                   <div className="p-2 bg-green-50 rounded border border-green-200">
                     <p className="text-green-700">💳 <strong>Tiền mặt:</strong> Khách hàng thanh toán ngay tại cửa hàng</p>
                   </div>
                 )}
                 {formData.payment_method === 'transfer' && (
                   <div className="p-2 bg-blue-50 rounded border border-blue-200">
                     <p className="text-blue-700">💳 <strong>Chuyển khoản:</strong> Thanh toán bằng chuyển khoản ngân hàng</p>
                   </div>
                 )}
               </div>
                               {errors.payment_method && (
                  <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>
                )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sản phẩm</h3>
              <button
                onClick={addProduct}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                type="button"
              >
                <Icons.Plus size={16} />
                Thêm sản phẩm
              </button>
            </div>

            {products.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
              </div>
            )}

            {selectedProducts.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm *</label>
                   <select
                     value={item.product_id || ''}
                     onChange={(e) => updateProduct(index, 'product_id', parseInt(e.target.value) || null)}
                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                       errors.products && selectedProducts[index]?.product_id === null
                         ? 'border-red-500 focus:ring-red-500'
                         : 'border-gray-300 focus:ring-pink-500'
                     }`}
                   >
                     <option value="">Chọn sản phẩm</option>
                     {products.map(product => (
                       <option key={product.id} value={product.id}>
                         {product.name} - {product.price.toLocaleString('vi-VN')} ₫ (Còn: {product.stock})
                       </option>
                     ))}
                   </select>
                   {errors.products && selectedProducts[index]?.product_id === null && (
                     <p className="mt-1 text-sm text-red-600">Vui lòng chọn sản phẩm</p>
                   )}
                 </div>
                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng *</label>
                   <input
                     type="number"
                     min="1"
                     value={item.quantity || ''}
                     onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                     className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                       errors.products && (!item.quantity || item.quantity <= 0)
                         ? 'border-red-500 focus:ring-red-500'
                         : 'border-gray-300 focus:ring-pink-500'
                     }`}
                     placeholder="1"
                   />
                   {errors.products && (!item.quantity || item.quantity <= 0) && (
                     <p className="mt-1 text-sm text-red-600">Số lượng phải ít nhất là 1</p>
                   )}
                 </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (₫)</label>
                  <input
                    type="number"
                    min="0"
                    value={item.price || ''}
                    onChange={(e) => updateProduct(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành tiền</label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-semibold">
                      {((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(index)}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {selectedProducts.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Chưa có sản phẩm nào. Hãy click "Thêm sản phẩm" để bắt đầu.</p>
              </div>
            )}
          </div>

                     <div className="border-t pt-6">
             <div className="flex items-center justify-between mb-4">
               <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
               <span className="text-2xl font-bold text-pink-600">
                 {(formData.total_amount || 0).toLocaleString('vi-VN')} ₫
               </span>
             </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                Hủy
              </button>
                             <button
                 onClick={handleSubmit}
                 disabled={loading || formData.total_amount <= 0}
                 className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 type="button"
               >
                 {loading ? 'Đang tạo...' : 'Tạo đơn hàng'}
               </button>
            </div>
          </div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Quản lý đơn hàng</h1>
              <p className="text-gray-600 mt-2">Xem và quản lý đơn hàng của khách hàng</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
            >
              <Icons.Plus size={20} />
              Tạo đơn hàng mới
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao hàng</option>
              <option value="delivered">Đã giao hàng</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <select
              value={selectedPayment}
              onChange={e => setSelectedPayment(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">Tất cả thanh toán</option>
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="vnpay">Thanh toán qua VNPay</option>
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
            </select>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredOrders.length} orders found
              </span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                          <div className="text-sm text-gray-500">{order.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items_count} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {Number(order.total_amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="text-gray-500" size={16} />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.payment_method === 'cod' && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">COD</span>
                        )}
                        {order.payment_method === 'vnpay' && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">VNPay</span>
                        )}
                        {order.payment_method === 'cash' && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">Tiền mặt</span>
                        )}
                        {order.payment_method === 'transfer' && (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">Chuyển khoản</span>
                        )}
                        {!['cod', 'vnpay', 'cash', 'transfer'].includes(order.payment_method || '') && order.payment_method && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">{order.payment_method}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-pink-600 hover:text-pink-900 font-semibold"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastOrder, filteredOrders.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icons.ChevronLeft size={20} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-pink-50 border-pink-500 text-pink-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icons.ChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Icons.ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal />
    </div>
  );
};

export default AdminOrders; 