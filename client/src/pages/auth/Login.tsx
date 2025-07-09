import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { login } from '../../features/auth/authSlice';
import authService from '../../services/authService';
import { Icons } from '../../components/icons';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email hoặc tên đăng nhập';
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && formData.email.length < 3) {
      newErrors.email = 'Tên đăng nhập không hợp lệ';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await dispatch(login(formData)).unwrap();
      const user = authService.getCurrentUser();
      if (user && user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.'
      });
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
              <span className="text-pink-600 font-semibold">Đăng nhập</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Left side - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block lg:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/90 to-pink-600/90 z-10" />
          <img
            src="/images/login-banner.jpg"
            alt="Login"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-6 text-center"
            >
              Chào Mừng Trở Lại!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-center max-w-md"
            >
              Đăng nhập để khám phá thế giới bánh ngọt tuyệt vời của chúng tôi
            </motion.p>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
        >
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-800 mb-2"
              >
                Đăng Nhập
              </motion.h1>
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-pink-600 hover:text-pink-700 font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                    placeholder="Nhập email hoặc tên đăng nhập của bạn"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200`}
                    placeholder="Nhập mật khẩu của bạn"
                  />
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-pink-600 hover:text-pink-700">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200 ${
                  isLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <Icons.Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                >
                  <Icons.FacebookF className="h-5 w-5 text-blue-600 mr-2" />
                  Facebook
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-200"
                >
                  <Icons.Google className="h-5 w-5 text-red-600 mr-2" />
                  Google
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 