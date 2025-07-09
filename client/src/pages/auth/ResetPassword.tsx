import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!newPassword) return 'Vui lòng nhập mật khẩu mới';
    if (newPassword.length < 6) return 'Mật khẩu mới phải có ít nhất 6 ký tự';
    if (newPassword !== confirmPassword) return 'Xác nhận mật khẩu không khớp';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/reset-password', { token, newPassword });
      setSuccess(res.data.message || 'Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Đặt lại mật khẩu</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
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
        <div className="mt-6 text-center">
          <Link to="/login" className="text-pink-600 hover:underline">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 