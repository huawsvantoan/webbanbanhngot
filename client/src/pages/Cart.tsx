import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../store';
import { motion } from 'framer-motion';
import { Icons } from '../components/icons';
import api from '../services/api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state: RootState) => state.auth);
  const [cartItems, setCartItems] = useState<any[]>([]); // Changed type to any[] as CartItem type is removed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!user) return;

    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cart');
        if (response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
        } else if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCartItems();
  }, [user, authLoading, navigate]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(itemId);
      await api.put(`/cart/items/${itemId}`, { quantity: newQuantity });
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Error updating quantity:', err);
      // Show error message
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      setCartItems(items => items.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
      // Show error message
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      // Show error message
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getDefaultImageForProduct = (productName: string) => {
    const name = productName.toLowerCase();
    
    // Bánh kem - tất cả đều dùng banner2
    if (name.includes('bánh kem')) {
      return '/images/banner2.avif';
    }
    
    // Bánh mì - tất cả đều dùng banner1  
    if (name.includes('bánh mì')) {
      return '/images/banner1.avif';
    }
    
    // Bánh bông lan - tất cả đều dùng banner4
    if (name.includes('bông lan')) {
      return '/images/banner4.avif';
    }
    
    // Bánh bao - tất cả đều dùng banner3
    if (name.includes('bánh bao')) {
      return '/images/banner3.avif';
    }
    
    // Bánh ngọt - phân loại cụ thể
    if (name.includes('tiramisu')) {
      return '/images/banner5.avif';
    }
    if (name.includes('cheesecake')) {
      return '/images/banner1.avif';
    }
    if (name.includes('brownie')) {
      return '/images/banner2.avif';
    }
    if (name.includes('cupcake')) {
      return '/images/banner3.avif';
    }
    
    // Bánh socola - tất cả đều dùng banner4
    if (name.includes('socola')) {
      return '/images/banner4.avif';
    }
    
    // Default
    return '/images/banner1.avif';
  };

  const getImageUrl = (product: any) => {
    // Nếu không có image_url, dùng ảnh mặc định
    if (!product.image_url) {
      return getDefaultImageForProduct(product.name);
    }

    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (product.image_url.startsWith('http://') || product.image_url.startsWith('https://')) {
      return product.image_url;
    }

    // Nếu bắt đầu bằng /images/, dùng trực tiếp (ảnh local trong public)
    if (product.image_url.startsWith('/images/')) {
      return product.image_url;
    }

    // Nếu là tên file trong uploads, thêm đường dẫn API
    if (product.image_url.startsWith('/uploads/')) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url}`;
    }

    // Nếu chỉ là tên file (không có /uploads/), thêm đường dẫn đầy đủ
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${product.image_url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Lỗi</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ Hàng</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <Icons.ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Giỏ hàng của bạn đang trống</h2>
            <p className="mt-2 text-gray-500">Thêm một số sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {cartItems.length} {cartItems.length === 1 ? 'Sản phẩm' : 'Sản phẩm'}
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Xóa Giỏ Hàng
                    </button>
                  </div>

                  {/* AnimatePresence is removed as per new_code, but keeping the structure */}
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center py-4 border-b border-gray-200 last:border-0"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          onError={(e) => { 
                            e.currentTarget.src = getDefaultImageForProduct(item.product.name); 
                          }}
                        />
                        {updating === item.id && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-800 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} / sản phẩm
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updating === item.id || item.quantity <= 1}
                              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Icons.Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value > 0 && value <= item.product.stock) {
                                  handleUpdateQuantity(item.id, value);
                                }
                              }}
                              disabled={updating === item.id}
                              className="w-16 px-2 py-2 text-center border-0 focus:outline-none focus:ring-0"
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id || item.quantity >= item.product.stock}
                              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Icons.Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={updating === item.id}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Icons.Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        {item.quantity >= item.product.stock && (
                          <p className="text-xs text-orange-600 mt-1">
                            Đã đạt số lượng tối đa
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-medium text-gray-800">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm Tắt Đơn Hàng</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{calculateSubtotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Tổng cộng</span>
                      <span>{calculateSubtotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700"
                  >
                    Tiến Hành Thanh Toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;