import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartItem } from '../types/cart';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/cart');
        if (response.data && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
        } else if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        setCartItems([]);
      }
    };
    fetchCart();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError('Vui lòng nhập họ tên!');
      setLoading(false);
      return;
    }
    try {
      if (paymentMethod === 'vnpay') {
        const orderData = {
          shipping_address: address,
          phone,
          note,
          payment_method: paymentMethod,
          name,
        };
        let orderRes;
        try {
          orderRes = await api.post('/orders', orderData);
          console.log('Order response:', orderRes.data);
        } catch (err: any) {
          console.error('Error creating order for VNPay:', err.response?.data || err.message);
          setError('Không tạo được đơn hàng! Vui lòng kiểm tra lại thông tin.');
          setLoading(false);
          return;
        }
        const orderId = orderRes.data?.order?.id;
        if (!orderId) {
          console.error('No order ID returned from server');
          setError('Không tạo được đơn hàng!');
          setLoading(false);
          return;
        }
        
        console.log('Creating VNPay payment for order:', orderId, 'amount:', total);
        const amountVND = Math.round(total);
        const res = await api.post('/payment/vnpay/create', {
          amount: amountVND,
          orderId,
          orderInfo: `Thanh toán đơn hàng Cake Shop - ${name}`,
        });
        
        console.log('VNPay payment URL created:', res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
        return;
      }
      // COD
      const orderData = {
        shipping_address: address,
        phone,
        note,
        payment_method: paymentMethod,
        name,
      };
      await api.post('/orders', orderData);
      setSuccess('Đặt hàng thành công!');
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err: any) {
      console.error('Order creation failed:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Đặt hàng thất bại!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPriceVND = (price: number) => price < 1000 ? price * 1000 : price;
  const total = cartItems.reduce((sum, item) => sum + getPriceVND(item.product.price) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">Giỏ hàng trống.</div>
        ) : (
          <>
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-2">Sản phẩm</h2>
              <ul>
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between border-b py-2">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{(getPriceVND(item.product.price) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold mt-2">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Họ tên</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Địa chỉ</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Số điện thoại</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Ghi chú</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Phương thức thanh toán</label>
                <div>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="form-radio"
                    />
                    <span className="ml-2">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="inline-flex items-center ml-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={() => setPaymentMethod('vnpay')}
                      className="form-radio"
                    />
                    <span className="ml-2">Thanh toán qua VNPay (ATM, QR, thẻ...)</span>
                  </label>
                </div>
              </div>
              {error && <div className="text-red-600 mb-2">{error}</div>}
              {success && <div className="text-green-600 mb-2">{success}</div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700">
                {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout; 