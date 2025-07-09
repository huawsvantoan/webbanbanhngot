import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types/cart';
import api from '../services/api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [inputQuantities, setInputQuantities] = useState<{ [key: number]: number }>({});

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      const items = response.data?.items || response.data;
      setCartItems(Array.isArray(items) ? items : []);
      const quantityMap: { [key: number]: number } = {};
      items.forEach((item: CartItem) => {
        quantityMap[item.id] = item.quantity;
      });
      setInputQuantities(quantityMap);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [user, navigate]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setUpdating(productId);
      await api.put(`/cart/${productId}`, { quantity: newQuantity });
      await fetchCartItems();
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await api.delete(`/cart/${productId}`);
      await fetchCartItems();
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]);
    } catch (err) {
      console.error('Lỗi khi xóa toàn bộ giỏ hàng:', err);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ Hàng Của Tôi</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <Icons.ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Giỏ hàng trống</h2>
            <p className="mt-2 text-gray-500">Thêm sản phẩm vào giỏ để tiếp tục mua sắm.</p>
            <button
              onClick={() => navigate('/products')}
              className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {cartItems.length} sản phẩm
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Xóa Tất Cả
                    </button>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center py-4 border-b border-gray-200 last:border-0"
                    >
                      <img
                        src={
                          item.product.image_url?.startsWith('http')
                            ? item.product.image_url
                            : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${item.product.image_url?.startsWith('/') ? '' : '/uploads/'}${item.product.image_url}`
                        }
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600">
                          {item.product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                        <div className="mt-2 flex items-center">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={updating === item.product.id || item.quantity <= 1}
                            className="px-2 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            min={1}
                            max={item.product.stock}
                            value={inputQuantities[item.id] ?? item.quantity}
                            onChange={(e) =>
                              setInputQuantities({
                                ...inputQuantities,
                                [item.id]: parseInt(e.target.value, 10),
                              })
                            }
                            onBlur={() =>
                              handleUpdateQuantity(
                                item.product.id,
                                inputQuantities[item.id] ?? item.quantity
                              )
                            }
                            disabled={updating === item.product.id}
                            className="w-16 px-2 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={updating === item.product.id || item.quantity >= item.product.stock}
                            className="px-2 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            disabled={updating === item.product.id}
                            className="ml-4 text-red-600 hover:text-red-700"
                            title="Xóa sản phẩm"
                          >
                            <Icons.Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="text-lg font-medium text-gray-800">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tóm Tắt Đơn Hàng</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{calculateSubtotal().toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Tổng cộng</span>
                      <span>{calculateSubtotal().toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700"
                  >
                    Tiến hành thanh toán
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