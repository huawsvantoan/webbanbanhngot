import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../services/api';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quên mật khẩu</h1>
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập email của bạn"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Mã xác thực</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập mã xác thực từ email"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập mật khẩu mới"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nhập lại mật khẩu mới"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-pink-600 hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 