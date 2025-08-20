import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../../services/api';
import { Icons } from '../../components/icons';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!email) return setError('Vui lòng nhập email');
    if (!validateEmail(email)) return setError('Email không hợp lệ');
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSuccess('Mã xác thực đã được gửi về email.');
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gửi mã xác thực thất bại.');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!code) return setError('Vui lòng nhập mã xác thực');
    if (!newPassword) return setError('Vui lòng nhập mật khẩu mới');
    if (newPassword.length < 6) return setError('Mật khẩu mới phải có ít nhất 6 ký tự');
    if (newPassword !== confirmPassword) return setError('Xác nhận mật khẩu không khớp');
    setLoading(true);
    try {
      await axios.post('/auth/reset-password', { email, code, newPassword });
      setSuccess('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại.');
    } finally { setLoading(false); }
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
            <li className="flex items-center">
              <Link to="/login" className="hover:text-pink-600">Đăng nhập</Link>
              <Icons.ChevronRight className="mx-2 w-4 h-4 text-gray-400" />
            </li>
            <li>
              <span className="text-pink-600 font-semibold">Quên mật khẩu</span>
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
                  <Icons.Lock className="w-14 h-14 text-white drop-shadow-lg" />
                </motion.div>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-6xl font-bold mb-8 text-center leading-tight drop-shadow-lg"
              >
                Quên Mật Khẩu?
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-xl text-center leading-relaxed opacity-95 font-medium"
              >
                Đừng lo lắng! Chúng tôi sẽ giúp bạn khôi phục mật khẩu một cách an toàn và nhanh chóng.
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

        {/* Right side - Form */}
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
                Khôi Phục Mật Khẩu
              </motion.h1>
              <p className="text-gray-600 text-lg mb-2">
                {step === 1 ? 'Nhập email để nhận mã xác thực' : 'Nhập mã xác thực và mật khẩu mới'}
              </p>
              <p className="text-gray-500">
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>

        {step === 1 && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {success}
                  </motion.div>
                )}
                
            <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Mail className="h-5 w-5 text-gray-400" />
                    </div>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                placeholder="Nhập email của bạn"
                disabled={loading}
              />
            </div>
                </div>

            <button
              type="submit"
              disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-105 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Icons.Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi mã xác thực'
                  )}
            </button>
              </motion.form>
        )}

        {step === 2 && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleResetPassword}
                className="space-y-6"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm"
                  >
                    {success}
                  </motion.div>
                )}
                
            <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Mã xác thực
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Check className="h-5 w-5 text-gray-400" />
                    </div>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                placeholder="Nhập mã xác thực từ email"
                disabled={loading}
              />
            </div>
                </div>

            <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Lock className="h-5 w-5 text-gray-400" />
                    </div>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
              />
            </div>
                </div>

            <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Lock className="h-5 w-5 text-gray-400" />
                    </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
            </div>
                </div>

            <button
              type="submit"
              disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200 transform hover:scale-105 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Icons.Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Đang đặt lại...
                    </>
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
            </button>
              </motion.form>
        )}
        </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword; 