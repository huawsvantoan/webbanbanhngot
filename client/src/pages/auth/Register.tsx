import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { register, clearError } from '../../features/auth/authSlice';
import { Icons } from '../../components/icons';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors: any = {};
    // Họ tên: bắt buộc, không chứa số hoặc ký tự đặc biệt
    if (!formData.full_name.trim()) newErrors.full_name = 'Vui lòng nhập họ tên';
    else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(formData.full_name.trim())) newErrors.full_name = 'Họ tên chỉ được chứa chữ cái và khoảng trắng';

    // Tên đăng nhập: bắt buộc, không chứa ký tự đặc biệt, không khoảng trắng, tối thiểu 3 ký tự
    if (!formData.username.trim()) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    else if (!/^[a-zA-Z0-9_]{3,}$/.test(formData.username.trim())) newErrors.username = 'Tên đăng nhập chỉ được chứa chữ, số, dấu gạch dưới, tối thiểu 3 ký tự, không khoảng trắng';

    // Email: bắt buộc, đúng định dạng
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^.+@.+\..+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';

    // Mật khẩu: bắt buộc, tối thiểu 6 ký tự
    if (!formData.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    // Xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';

    // Địa chỉ: bắt buộc, tối thiểu 5 ký tự
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    else if (formData.address.trim().length < 5) newErrors.address = 'Địa chỉ phải có ít nhất 5 ký tự';

    // Số điện thoại: bắt buộc, đúng định dạng Việt Nam
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^0\d{9}$/.test(formData.phone.trim())) newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await dispatch(register(formData)).unwrap();
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Breadcrumb / Navigation */}
      <nav className="bg-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <ol className="flex text-gray-600 text-sm">
            <li className="flex items-center">
              <Link to="/" className="hover:text-pink-600">Trang chủ</Link>
              <Icons.ChevronRight className="mx-2 w-4 h-4 text-gray-400" />
            </li>
            <li>
              <span className="text-pink-600 font-semibold">Đăng ký</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Left side - Enhanced Design */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        >
          {/* Background with beautiful gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600" />
          
          {/* Animated decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/15 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/3 left-20 w-12 h-12 bg-white/8 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Main content */}
          <div className="relative z-20 flex flex-col justify-center items-center text-white p-12 h-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-lg"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-28 h-28 bg-white/25 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-2xl border border-white/20"
                >
                  <Icons.Cake className="w-14 h-14 text-white drop-shadow-lg" />
                </motion.div>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-6xl font-bold mb-8 text-center leading-tight drop-shadow-lg"
              >
                Tạo Tài Khoản Mới
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-center leading-relaxed opacity-95 font-medium"
              >
                Đăng ký để nhận ưu đãi và trải nghiệm dịch vụ tuyệt vời từ Cake Shop!
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-10 flex justify-center space-x-3"
              >
                <div className="w-4 h-4 bg-white/40 rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-4 h-4 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white"
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-800 mb-4"
              >
                Đăng Ký
              </motion.h1>
              <p className="text-gray-600 text-lg mb-2">
                Tạo tài khoản mới để bắt đầu
              </p>
              <p className="text-gray-500">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                >
                  {errors.submit}
                </motion.div>
              )}
              
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.full_name ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập họ tên"
                />
                {errors.full_name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.full_name}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập tên đăng nhập"
                />
                {errors.username && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.username}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập email"
                />
                {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.email}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập mật khẩu"
                />
                {errors.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.password}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập lại mật khẩu"
                />
                {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.confirmPassword}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập địa chỉ"
                />
                {errors.address && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.address}</motion.p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-sm text-red-600">{errors.phone}</motion.p>}
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Icons.Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Đang đăng ký...
                  </>
                ) : (
                  'Đăng Ký'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 