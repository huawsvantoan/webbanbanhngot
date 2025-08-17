import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/icons';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { contactSchema, ContactFormData } from '../validations/contactSchema';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  const validateField = async (field: keyof ContactFormData, value: string) => {
    try {
      await contactSchema.validateAt(field, { ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (err: any) {
      setErrors(prev => ({ ...prev, [field]: err.message }));
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Bạn cần đăng nhập để gửi liên hệ!');
      navigate('/login');
      return;
    }

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });

    try {
      // Validate entire form
      await contactSchema.validate(formData, { abortEarly: false });
      
      setLoading(true);
      await api.post('/contacts', formData);
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (err: any) {
      if (err.name === 'ValidationError') {
        // Handle validation errors
        const validationErrors: FormErrors = {};
        err.inner.forEach((error: any) => {
          validationErrors[error.path as keyof ContactFormData] = error.message;
        });
        setErrors(validationErrors);
        toast.error('Vui lòng kiểm tra lại thông tin!');
      } else {
        // Handle API errors
        toast.error(err.response?.data?.message || 'Gửi liên hệ thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (field: keyof ContactFormData) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200";
    const hasError = errors[field] && touched[field];
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-pink-500 focus:border-pink-500`;
  };

  return (
    <>
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
                  <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                    Tên của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={getInputClassName('name')}
                    placeholder="Nhập tên của bạn"
                  />
                  {errors.name && touched.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <Icons.AlertCircle size={14} />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                    Email của bạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={getInputClassName('email')}
                    placeholder="Nhập email của bạn"
                  />
                  {errors.email && touched.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <Icons.AlertCircle size={14} />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">
                    Chủ đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={e => handleChange('subject', e.target.value)}
                    onBlur={() => handleBlur('subject')}
                    className={getInputClassName('subject')}
                    placeholder="Nhập chủ đề"
                  />
                  {errors.subject && touched.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <Icons.AlertCircle size={14} />
                      {errors.subject}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
                    Tin nhắn của bạn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={e => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    className={getInputClassName('message')}
                    placeholder="Nhập tin nhắn của bạn"
                  ></textarea>
                  {errors.message && touched.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    >
                      <Icons.AlertCircle size={14} />
                      {errors.message}
                    </motion.p>
                  )}
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.message.length}/1000 ký tự
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-md transform hover:scale-105 ${
                    loading
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Đang gửi...
                    </div>
                  ) : (
                    'Gửi Tin Nhắn'
                  )}
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

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Gửi Tin Nhắn Thành Công!</h3>
              <p className="text-gray-600 mb-6">
                Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi sớm nhất có thể.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact; 