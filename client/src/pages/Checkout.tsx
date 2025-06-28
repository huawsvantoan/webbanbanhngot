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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
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
    if (paymentMethod === 'bank' && !paymentProof) {
      setError('Vui lòng upload ảnh chuyển khoản!');
      setLoading(false);
      return;
    }
    try {
      let formData: FormData | null = null;
      if (paymentMethod === 'bank' && paymentProof) {
        formData = new FormData();
        formData.append('shipping_address', address);
        formData.append('phone', phone);
        formData.append('note', note);
        formData.append('payment_method', paymentMethod);
        formData.append('payment_proof', paymentProof);
        formData.append('name', name);
      }
      const orderData = {
        shipping_address: address,
        phone,
        note,
        payment_method: paymentMethod,
        name,
      };
      if (formData) {
        await api.post('/orders', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/orders', orderData);
      }
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

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

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
                    <span>{(item.product.price * item.quantity).toFixed(2)}₫</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-bold mt-2">
                <span>Tổng cộng</span>
                <span>{total.toFixed(2)}₫</span>
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
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="form-radio"
                    />
                    <span className="ml-2">Chuyển khoản ngân hàng</span>
                  </label>
                </div>
                {paymentMethod === 'bank' && (
                  <>
                    <div className="mt-2 p-3 bg-gray-100 rounded">
                      <div><b>Ngân hàng:</b> Vietcombank</div>
                      <div><b>Số tài khoản:</b> 0123456789</div>
                      <div><b>Chủ tài khoản:</b> Nguyễn Văn A</div>
                      <div className="text-xs text-gray-500 mt-1">Vui lòng chuyển khoản và ghi rõ nội dung: "Tên + SĐT đặt hàng"</div>
                    </div>
                    <div className="mt-3 mb-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 font-semibold">
                      <b>Chú ý:</b> Sau khi chuyển khoản và xác nhận thanh toán, đơn hàng sẽ <u>không thể hủy hoặc hoàn tiền trực tuyến</u>.
                      Vui lòng kiểm tra kỹ thông tin trước khi đặt hàng!
                    </div>
                    <div className="mt-3">
                      <label className="block mb-1 font-medium">Ảnh chuyển khoản <span className="text-red-500">*</span></label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                        required={paymentMethod === 'bank'}
                        className="w-full border px-3 py-2 rounded"
                      />
                    </div>
                  </>
                )}
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