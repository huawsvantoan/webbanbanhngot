import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CartItem } from '../types/cart';

interface ValidationErrors {
  name?: string;
  address?: string;
  phone?: string;
  general?: string;
}

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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  // Validation functions
  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng nhập họ tên!';
    if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự!';
    if (value.trim().length > 50) return 'Họ tên không được quá 50 ký tự!';
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) return 'Họ tên chỉ được chứa chữ cái và khoảng trắng!';
    return undefined;
  };

  const validateAddress = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng nhập địa chỉ giao hàng!';
    if (value.trim().length < 10) return 'Địa chỉ phải có ít nhất 10 ký tự!';
    if (value.trim().length > 200) return 'Địa chỉ không được quá 200 ký tự!';
    return undefined;
  };

  const validatePhone = (value: string): string | undefined => {
    if (!value.trim()) return 'Vui lòng nhập số điện thoại!';
    const phoneRegex = /^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/;
    if (!phoneRegex.test(value.trim())) return 'Số điện thoại không hợp lệ! Ví dụ: 0123456789';
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    const nameError = validateName(name);
    if (nameError) errors.name = nameError;
    
    const addressError = validateAddress(address);
    if (addressError) errors.address = addressError;
    
    const phoneError = validatePhone(phone);
    if (phoneError) errors.phone = phoneError;

    if (cartItems.length === 0) {
      errors.general = 'Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi đặt hàng.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    // Update field value
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'note':
        setNote(value);
        break;
    }

    // Clear error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate specific field
    let error: string | undefined;
    switch (field) {
      case 'name':
        error = validateName(name);
        break;
      case 'address':
        error = validateAddress(address);
        break;
      case 'phone':
        error = validatePhone(phone);
        break;
    }
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({ name: true, address: true, phone: true });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (paymentMethod === 'vnpay') {
        console.log('VNPay payment method selected');
        const orderData = {
          shipping_address: address.trim(),
          phone: phone.trim(),
          note: note.trim(),
          payment_method: paymentMethod,
          name: name.trim(),
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
          orderInfo: `Thanh toán đơn hàng Cake Shop - ${name.trim()}`,
        });
        
        console.log('VNPay payment URL created:', res.data.paymentUrl);
        window.location.href = res.data.paymentUrl;
        return;
      }
      
      // COD payment
      const orderData = {
        shipping_address: address.trim(),
        phone: phone.trim(),
        note: note.trim(),
        payment_method: paymentMethod,
        name: name.trim(),
      };
      
      await api.post('/orders', orderData);
      setSuccess('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      setTimeout(() => navigate('/orders'), 2000);
      
    } catch (err: any) {
      console.error('Order creation failed:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Đặt hàng thất bại! Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPriceVND = (price: number) => price < 1000 ? price * 1000 : price;
  const total = cartItems.reduce((sum, item) => sum + getPriceVND(item.product.price) * item.quantity, 0);

  const getFieldError = (field: string): string | undefined => {
    return touched[field] ? validationErrors[field as keyof ValidationErrors] : undefined;
  };

  const getFieldClassName = (field: string): string => {
    const baseClass = "w-full border px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500";
    const error = getFieldError(field);
    
    if (error) {
      return `${baseClass} border-red-500 focus:border-red-500`;
    }
    
    return `${baseClass} border-gray-300 focus:border-pink-500`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <button 
              onClick={() => navigate('/products')} 
              className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Thanh toán</h1>
        
        {/* Order Summary */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tóm tắt đơn hàng</h2>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.product.image_url || '/default-cake.jpg'} 
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <span className="font-medium text-gray-800">{item.product.name}</span>
                    <span className="text-sm text-gray-500 block">Số lượng: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  {(getPriceVND(item.product.price) * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-semibold text-gray-800">Tổng cộng</span>
            <span className="text-2xl font-bold text-pink-600">
              {total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Thông tin giao hàng</h2>
          
          {/* Name Field */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Họ tên <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleFieldBlur('name')}
              className={getFieldClassName('name')}
              placeholder="Nhập họ tên đầy đủ"
            />
            {getFieldError('name') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getFieldError('name')}
              </p>
            )}
          </div>

          {/* Address Field */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Địa chỉ giao hàng <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={address} 
              onChange={(e) => handleFieldChange('address', e.target.value)}
              onBlur={() => handleFieldBlur('address')}
              className={getFieldClassName('address')}
              rows={3}
              placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
            />
            {getFieldError('address') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getFieldError('address')}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              className={getFieldClassName('phone')}
              placeholder="Ví dụ: 0123456789"
            />
            {getFieldError('phone') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {getFieldError('phone')}
              </p>
            )}
          </div>

          {/* Note Field */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Ghi chú <span className="text-gray-500 text-sm">(không bắt buộc)</span>
            </label>
            <textarea 
              value={note} 
              onChange={(e) => handleFieldChange('note', e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              rows={3}
              placeholder="Ghi chú về đơn hàng, thời gian giao hàng, hoặc yêu cầu đặc biệt..."
            />
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block mb-3 font-medium text-gray-700">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="form-radio text-pink-600 focus:ring-pink-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                  <p className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={() => setPaymentMethod('vnpay')}
                  className="form-radio text-pink-600 focus:ring-pink-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-800">Thanh toán qua VNPay</span>
                  <p className="text-sm text-gray-600">ATM, QR Code, thẻ tín dụng/ghi nợ</p>
                </div>
              </label>
            </div>
            
            {paymentMethod === 'vnpay' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Lưu ý quan trọng</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>• Đơn hàng thanh toán qua VNPay sẽ được xử lý ngay lập tức</p>
                      <p>• Không thể tự hủy đơn hàng sau khi thanh toán thành công</p>
                      <p>• Nếu cần hủy và hoàn tiền, vui lòng liên hệ hỗ trợ khách hàng</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error and Success Messages */}
          {validationErrors.general && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700 font-medium">{validationErrors.general}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-green-700 font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-pink-600 text-white rounded-lg font-semibold text-lg hover:bg-pink-700 disabled:bg-pink-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              `Đặt hàng - ${total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 