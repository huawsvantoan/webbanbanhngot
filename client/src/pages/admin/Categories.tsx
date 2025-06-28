import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  productCount?: number;
  isDeleted: number;
}

const AdminCategories: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [categoryToPermanentDelete, setCategoryToPermanentDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    // The isAdmin check and navigation is now handled by AdminRoute
    fetchCategories();
  }, [navigate]); // Removed isAdmin from dependency array

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories?includeDeleted=true');
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Category updated successfully');
        setEditingCategory(null);
      } else {
        await api.post('/categories', formData);
        toast.success('Category created successfully');
      }
      
      setFormData({ name: '', description: '', image_url: '' });
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image_url: category.image_url || ''
    });
    setShowForm(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    console.log("Attempting to delete category:", category);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        await api.delete(`/categories/${categoryToDelete.id}`);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete category');
      } finally {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await api.put(`/categories/${id}/restore`);
      toast.success('Khôi phục danh mục thành công');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Khôi phục danh mục thất bại');
    }
  };

  const handlePermanentDeleteClick = (category: Category) => {
    setCategoryToPermanentDelete(category);
    setShowPermanentDeleteModal(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!categoryToPermanentDelete) return;
    try {
      await api.delete(`/admin/categories/${categoryToPermanentDelete.id}/permanent`);
      toast.success('Đã xóa vĩnh viễn danh mục');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa vĩnh viễn thất bại');
    } finally {
      setShowPermanentDeleteModal(false);
      setCategoryToPermanentDelete(null);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-800">Quản lý danh mục</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-pink-700 transition-colors"
          >
            <Icons.Plus size={20} />
            Thêm danh mục mới
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${category.isDeleted === 1 ? 'opacity-60' : ''}`}
            >
              {category.image_url && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{category.productCount || 0} sản phẩm</span>
                  <span>{new Date(category.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  {Number(category.isDeleted) === 1 ? (
                    <>
                      <button
                        onClick={() => handleRestore(category.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        title="Khôi phục danh mục này"
                      >
                        <Icons.CheckCircle size={16} />
                        Khôi phục
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteClick(category)}
                        className="flex-1 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                        title="Xóa vĩnh viễn danh mục này"
                      >
                        <Icons.Trash2 size={16} />
                        Xóa vĩnh viễn
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.FolderOpen size={16} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.Trash2 size={16} />
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Tên danh mục</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Ảnh (URL)</label>
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    type="button"
                    onClick={() => { setShowForm(false); setEditingCategory(null); }}
                  >
                    Đóng
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
                    type="submit"
                  >
                    {editingCategory ? 'Lưu thay đổi' : 'Thêm danh mục'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && categoryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2 text-red-600">Xác nhận xóa danh mục</h3>
              <p className="mb-4">Bạn có chắc chắn muốn xóa danh mục <b>{categoryToDelete.name}</b> không?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Đóng
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={handleDeleteConfirm}
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal xác nhận xóa vĩnh viễn */}
      <AnimatePresence>
        {showPermanentDeleteModal && categoryToPermanentDelete && (
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
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Xác nhận xóa vĩnh viễn danh mục</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn <b>xóa vĩnh viễn</b> danh mục "{categoryToPermanentDelete.name}"? Hành động này <b>không thể hoàn tác</b>.
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

export default AdminCategories; 