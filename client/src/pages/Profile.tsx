import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { getProfile, updateProfile, clearError, logout, changePassword } from '../features/auth/authSlice';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { User } from '../services/authService';

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
      setFormData({
        full_name: user.full_name || '',
        address: user.address || '',
        phone: user.phone || '',
      });
    } else {
      // Fetch profile if user data is not in Redux state (e.g., after page refresh)
      dispatch(getProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  const validateForm = () => {
    const errors: Partial<User> = {};
    let isValid = true;

    // Add basic validation for phone if it's not empty
    if (formData.phone && !/^\\d{10,15}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be between 10-15 digits';
      isValid = false;
    }

    setFormErrors(errors);
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
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setUpdateSuccess(true);
      setIsEditing(false);
      // Re-fetch profile to ensure Redux state is updated with latest data from backend
      dispatch(getProfile());
    } catch (err) {
      // Error is handled by auth slice
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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

  if (loading && !user) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-8 text-gray-600">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Your Profile</h1>

        {updateSuccess && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm text-center">
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-700">Username:</p>
            <p className="text-gray-900 font-semibold text-lg">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="text-gray-900 font-semibold text-lg">{user.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700">Full Name:</p>
              <p className="text-gray-900 text-lg">{user.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Address:</p>
              <p className="text-gray-900 text-lg">{user.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Phone:</p>
              <p className="text-gray-900 text-lg">{user.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Role:</p>
              <p className="text-gray-900 text-lg capitalize">{user.role}</p>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-pink-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Đổi mật khẩu
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4 mb-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm ${
                  formErrors.phone ? 'border-red-500' : ''
                }`}
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="space-y-4 mb-6 mt-6 bg-gray-50 p-6 rounded-lg border border-pink-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Đổi mật khẩu</h2>
            {passwordErrors.submit && <div className="text-red-500 text-sm mb-2">{passwordErrors.submit}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm mb-2">{passwordSuccess}</div>}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border ${passwordErrors.oldPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500`}
                placeholder="Nhập mật khẩu cũ"
              />
              {passwordErrors.oldPassword && <div className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</div>}
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border ${passwordErrors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500`}
                placeholder="Nhập mật khẩu mới"
              />
              {passwordErrors.newPassword && <div className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</div>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border ${passwordErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500`}
                placeholder="Nhập lại mật khẩu mới"
              />
              {passwordErrors.confirmPassword && <div className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</div>}
            </div>
            <div className="flex justify-end space-x-4 pt-2">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                className="px-4 py-2 border border-transparent text-sm rounded-md text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
              >
                {passwordLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile; 