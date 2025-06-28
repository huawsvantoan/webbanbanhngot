import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/icons';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Bạn cần đăng nhập để gửi liên hệ!');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contacts', { name, email, subject, message });
      toast.success('Gửi liên hệ thành công!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gửi liên hệ thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn lòng lắng nghe bạn. Hãy điền vào biểu mẫu dưới đây hoặc liên hệ trực tiếp với chúng tôi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Tên của bạn</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email của bạn</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">Chủ đề</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                  placeholder="Nhập chủ đề"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">Tin nhắn của bạn</label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200"
                  placeholder="Nhập tin nhắn của bạn"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-pink-700 transition-colors duration-300 shadow-md transform hover:scale-105"
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>
              <div className="space-y-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                    <Icons.MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Địa Chỉ Cửa Hàng</h3>
                    <p className="text-gray-600">70 hòa nam 2 hòa an cẩm lệ đà nẵng</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                    <Icons.Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Số Điện Thoại</h3>
                    <p className="text-gray-600">+84 395107987</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                    <Icons.Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Địa Chỉ Email</h3>
                    <p className="text-gray-600">toanhvpd10466@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Theo Dõi Chúng Tôi</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200">
                  <Icons.FacebookF size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200">
                  <Icons.Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200">
                  <Icons.Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors duration-200">
                  <Icons.LinkedinIn size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 