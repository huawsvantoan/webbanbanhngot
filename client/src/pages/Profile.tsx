import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { getProfile, updateProfile, clearError, logout, changePassword } from '../features/auth/authSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { User } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useAppSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<Partial<User>>({
    full_name: '',
    address: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<any>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      // Đảm bảo formData được khởi tạo với dữ liệu user hiện tại
      setFormData({
        full_name: user.full_name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
      console.log('Form data initialized:', {
        full_name: user.full_name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    } else {
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  // Thêm useEffect để debug
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Current formData:', formData);
    console.log('isEditing:', isEditing);
  }, [user, formData, isEditing]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const validateForm = () => {
    const errors: Partial<User> = {};
    let isValid = true;

    // Chỉ validate phone nếu user nhập vào và không để trống
    if (formData.phone && formData.phone.trim() !== '') {
      if (!/^\d{10,15}$/.test(formData.phone.trim())) {
        errors.phone = 'Số điện thoại phải có 10-15 chữ số';
        isValid = false;
      }
    }

    // Chỉ validate full_name nếu user nhập vào và không để trống
    if (formData.full_name && formData.full_name.trim() !== '') {
      if (formData.full_name.trim().length < 2) {
        errors.full_name = 'Họ tên phải có ít nhất 2 ký tự';
        isValid = false;
      }
    }

    // Chỉ validate address nếu user nhập vào và không để trống
    if (formData.address && formData.address.trim() !== '') {
      if (formData.address.trim().length < 5) {
        errors.address = 'Địa chỉ phải có ít nhất 5 ký tự';
      isValid = false;
      }
    }

    setFormErrors(errors);
    console.log('Validation result:', { errors, isValid, formData });
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, validating...');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, submitting data:', formData);
    setUpdateLoading(true);

    try {
      const updatedUser = await dispatch(updateProfile(formData)).unwrap();
      console.log('Profile updated successfully:', updatedUser);
      setUpdateSuccess(true);
      setIsEditing(false);
      // Không cần gọi getProfile nữa vì state đã được cập nhật tự động
    } catch (err: any) {
      console.error('Profile update failed:', err);
      // Error is handled by auth slice
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const resetFormData = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
      setFormErrors({});
      console.log('Form data reset to:', {
        full_name: user.full_name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    }
  };

  const handleEditClick = () => {
    resetFormData();
    setIsEditing(true);
  };

  const validatePasswordForm = () => {
    const errors: any = {};
    if (!passwordData.oldPassword) errors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    if (!passwordData.newPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (passwordData.newPassword.length < 6) errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    else if (passwordData.newPassword === passwordData.oldPassword) errors.newPassword = 'Mật khẩu mới phải khác mật khẩu cũ';
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    else if (passwordData.confirmPassword !== passwordData.newPassword) errors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordErrors((prev: Record<string, string>) => ({ ...prev, [name]: '' }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    if (!validatePasswordForm()) return;
    setPasswordLoading(true);
    try {
      await dispatch(changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
    } catch (err: any) {
      setPasswordErrors({ submit: err.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return { text: 'Quản trị viên', color: 'bg-purple-100 text-purple-800', icon: '👑' };
      case 'user':
        return { text: 'Khách hàng', color: 'bg-blue-100 text-blue-800', icon: '👤' };
      default:
        return { text: role, color: 'bg-gray-100 text-gray-800', icon: '🔧' };
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem thông tin tài khoản</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const roleInfo = getRoleDisplay(user?.role || 'user');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl text-white font-bold">
                {user?.full_name && user.full_name.trim() 
                  ? user.full_name.charAt(0).toUpperCase() 
                  : user?.username && user.username.trim()
                    ? user.username.charAt(0).toUpperCase()
                    : 'U'
                }
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Thông tin tài khoản</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật</p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
        {updateSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-center"
              >
                <div className="flex items-center justify-center">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="font-medium">Cập nhật thông tin thành công!</span>
          </div>
              </motion.div>
        )}
          </AnimatePresence>

          {/* Error Message */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center">
              <div className="flex items-center justify-center">
                <span className="text-red-500 mr-2">❌</span>
                <span className="font-medium">{error}</span>
              </div>
          </div>
        )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">👤</span>
                  <h3 className="text-lg font-semibold text-gray-800">Thông tin cơ bản</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Tên đăng nhập</p>
                    <p className="text-gray-900 font-semibold text-lg bg-white px-3 py-2 rounded-lg border">
                      {user?.username || 'Chưa có'}
                    </p>
                  </div>
          <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Họ và tên</p>
                    <p className="text-gray-900 font-semibold text-lg bg-white px-3 py-2 rounded-lg border">
                      {user?.full_name || 'Chưa cập nhật'}
                    </p>
          </div>
          <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Vai trò</p>
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${roleInfo.color}`}>
                      <span className="mr-2">{roleInfo.icon}</span>
                      {roleInfo.text}
                    </div>
                  </div>
                </div>
          </div>
        </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">📧</span>
                  <h3 className="text-lg font-semibold text-gray-800">Thông tin liên hệ</h3>
                </div>
                <div className="space-y-4">
            <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900 font-semibold text-lg bg-white px-3 py-2 rounded-lg border break-all">
                      {user?.email || 'Chưa có'}
                    </p>
            </div>
            <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Số điện thoại</p>
                    <p className="text-gray-900 font-semibold text-lg bg-white px-3 py-2 rounded-lg border">
                      {user?.phone || 'Chưa cập nhật'}
                    </p>
            </div>
            <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Địa chỉ</p>
                    <p className="text-gray-900 font-semibold text-lg bg-white px-3 py-2 rounded-lg border">
                      {user?.address || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>

          {/* Action Buttons */}
          {!isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
            >
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center justify-center px-6 py-3 border-2 border-pink-200 text-pink-600 bg-pink-50 rounded-xl font-medium hover:bg-pink-100 hover:border-pink-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <span className="mr-2">🔐</span>
                Đổi mật khẩu
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 shadow-lg"
              >
                <span className="mr-2">✏️</span>
                Chỉnh sửa thông tin
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <span className="mr-2">🚪</span>
                Đăng xuất
              </button>
            </motion.div>
          )}

          {/* Edit Form */}
          <AnimatePresence>
            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleUpdate}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6"
              >
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">✏️</span>
                  <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
            </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập
              </label>
              <input
                type="text"
                      id="username"
                      name="username"
                      value={user?.username || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Tên đăng nhập"
                    />
                    <p className="text-xs text-gray-400 mt-1">Không thể thay đổi tên đăng nhập</p>
            </div>

            <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Email"
                    />
                    <p className="text-xs text-gray-400 mt-1">Không thể thay đổi email</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
              </label>
              <input
                type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name || ''}
                onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.full_name ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Nhập họ và tên đầy đủ"
                    />
                    {formErrors.full_name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {formErrors.full_name}
                      </p>
                    )}
            </div>

            <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
              </label>
              <input
                      type="tel"
                id="phone"
                name="phone"
                      value={formData.phone || ''}
                onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        formErrors.phone ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                }`}
                      placeholder="Ví dụ: 0123456789"
              />
              {formErrors.phone && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      formErrors.address ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                  {formErrors.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {formErrors.address}
                    </p>
              )}
            </div>

                <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data về giá trị user hiện tại
                      setFormData({
                        full_name: user?.full_name || '',
                        address: user?.address || '',
                        phone: user?.phone || '',
                      });
                      setFormErrors({});
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Hủy bỏ
              </button>
              <button
                type="submit"
                    disabled={updateLoading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {updateLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang lưu...
                      </div>
                    ) : (
                      'Lưu thay đổi'
                    )}
              </button>
            </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Change Password Form */}
          <AnimatePresence>
            {showChangePassword && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleChangePassword}
                className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
              >
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">🔐</span>
                  <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
                </div>
                
                {passwordErrors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">❌</span>
                      <span>{passwordErrors.submit}</span>
                    </div>
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      <span>{passwordSuccess}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        passwordErrors.oldPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    {passwordErrors.oldPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {passwordErrors.oldPassword}
                      </p>
                    )}
            </div>

            <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                        passwordErrors.newPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                      }`}
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>
            </div>

                <div className="mt-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      passwordErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
                    }`}
                placeholder="Nhập lại mật khẩu mới"
              />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
            </div>

                <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 bg-white rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                    Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {passwordLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang đổi mật khẩu...
                      </div>
                    ) : (
                      'Đổi mật khẩu'
                    )}
              </button>
            </div>
              </motion.form>
        )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 