import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

type User = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  address: string;
  phone: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  isDeleted: number;
};

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [userToPermanentDelete, setUserToPermanentDelete] = useState<User | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, authLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users?includeDeleted=true');
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      toast.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa người dùng thất bại');
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleRoleUpdate = async (newRole: 'user' | 'admin') => {
    if (!userToUpdate) return;
    try {
      await api.put(`/admin/users/${userToUpdate.id}/role`, { role: newRole });
      setUsers(users.map(user =>
        user.id === userToUpdate.id
          ? { ...user, role: newRole }
          : user
      ));
      toast.success('Cập nhật quyền người dùng thành công');
      setShowRoleModal(false);
      setUserToUpdate(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật quyền người dùng thất bại');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/restore`);
      toast.success('Khôi phục người dùng thành công');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Khôi phục người dùng thất bại');
    }
  };

  const handlePermanentDeleteClick = (user: User) => {
    setUserToPermanentDelete(user);
    setShowPermanentDeleteModal(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!userToPermanentDelete) return;
    try {
      await api.delete(`/admin/users/${userToPermanentDelete.id}/permanent`);
      toast.success('Đã xóa vĩnh viễn người dùng');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa vĩnh viễn thất bại');
    } finally {
      setShowPermanentDeleteModal(false);
      setUserToPermanentDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    ((user.full_name || user.username || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
    ((user.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        <span className="ml-4 text-gray-600 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Lỗi</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quyền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`hover:bg-gray-50 ${user.isDeleted === 1 ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name || user.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at || '').toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-4">
                        {user.isDeleted === 1 ? (
                          <>
                            <button
                              onClick={() => handleRestore(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Khôi phục
                            </button>
                            <button
                              onClick={() => handlePermanentDeleteClick(user)}
                              className="text-red-700 hover:text-red-900 ml-2"
                            >
                              Xóa vĩnh viễn
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setUserToUpdate(user);
                                setShowRoleModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Đổi quyền
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Icons.Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Role Update Modal */}
      <AnimatePresence>
        {showRoleModal && userToUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Đổi quyền người dùng</h3>
              <p className="text-gray-600 mb-6">
                Quyền hiện tại: <span className={`font-semibold ${
                  userToUpdate.role === 'admin' ? 'text-purple-800' : 'text-gray-800'
                }`}>
                  {userToUpdate.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(['user', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => handleRoleUpdate(role)}
                    disabled={role === userToUpdate.role}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      role === userToUpdate.role
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                    }`}
                  >
                    {role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setUserToUpdate(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && userToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Xác nhận xóa người dùng</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa người dùng "{userToDelete.full_name || userToDelete.username}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Đóng
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal xác nhận xóa vĩnh viễn */}
      <AnimatePresence>
        {showPermanentDeleteModal && userToPermanentDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Xác nhận xóa vĩnh viễn người dùng</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn <b>xóa vĩnh viễn</b> người dùng "{userToPermanentDelete.full_name || userToPermanentDelete.username}"? Hành động này <b>không thể hoàn tác</b>.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPermanentDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Đóng
                </button>
                <button
                  onClick={handlePermanentDeleteConfirm}
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                >
                  Xác nhận xóa vĩnh viễn
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers; 