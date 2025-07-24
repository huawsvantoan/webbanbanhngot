import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>("pending");
  const [message, setMessage] = useState('Đang xác thực email...');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Thiếu token xác thực.');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.data.message || 'Xác thực email thành công!');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Xác thực email thất bại.');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Xác thực Email</h2>
        <p className={status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-700'}>
          {message}
        </p>
        {status === 'success' && <p className="mt-4 text-gray-500">Bạn sẽ được chuyển đến trang đăng nhập...</p>}
      </div>
    </div>
  );
};

export default VerifyEmail; 