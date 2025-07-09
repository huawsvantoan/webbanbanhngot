import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import { bannerSchema } from '../../validations/bannerSchema';
import { useFormik } from 'formik';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  button_text: string;
  button_link: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminBannerManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Form state
  const formik = useFormik({
    initialValues: {
    title: '',
    subtitle: '',
    description: '',
    image: '',
    button_text: '',
    button_link: '',
    position: 1,
      is_active: true,
    },
    validationSchema: bannerSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingBanner) {
        handleUpdateBanner(values);
      } else {
        handleCreateBanner(values);
      }
    },
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/banners');
      setBanners(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch banners');
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async (values: any) => {
    try {
      await api.post('/admin/banners', values);
      toast.success('Tạo banner thành công');
      setShowCreateModal(false);
      resetForm();
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tạo banner thất bại');
    }
  };

  const handleUpdateBanner = async (values: any) => {
    if (!editingBanner) return;
    try {
      await api.put(`/admin/banners/${editingBanner.id}`, values);
      toast.success('Cập nhật banner thành công');
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật banner thất bại');
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      await api.delete(`/admin/banners/${bannerToDelete.id}`);
      toast.success('Banner deleted successfully');
      setShowDeleteModal(false);
      setBannerToDelete(null);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete banner');
    }
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    formik.setValues({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      image: banner.image,
      button_text: banner.button_text,
      button_link: banner.button_link,
      position: banner.position,
      is_active: banner.is_active,
    });
  };

  const handleDeleteClick = (banner: Banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    formik.resetForm();
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await api.put(`/admin/banners/${banner.id}`, {
        ...banner,
        is_active: !banner.is_active
      });
      toast.success(`Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update banner status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
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
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Banners</h1>
              <p className="text-gray-600 mt-2">Create and manage homepage banners</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <Icons.Plus size={20} />
              Create Banner
            </button>
          </div>
        </motion.div>

        {/* Banners List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={banner.image || '/images/default-banner.jpg'}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    banner.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    Vị trí {banner.position}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {banner.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  {banner.subtitle}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {banner.description}
                </p>
                
                {banner.button_text && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Nút:</span>
                    <div className="mt-1">
                      <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded text-sm">
                        {banner.button_text}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(banner)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Icons.FolderOpen size={16} />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                      banner.is_active
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <Icons.Eye size={16} />
                        <span className="ml-1">Ẩn</span>
                      </>
                    ) : (
                      <>
                        <Icons.Eye size={16} />
                        <span className="ml-1">Hiển thị</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(banner)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {banners.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Icons.Gift className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-600">Create your first banner to get started.</p>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || editingBanner) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                  </h2>
                  
                  <form onSubmit={formik.handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề
                      </label>
                      <input
                        type="text"
                          name="title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Nhập tiêu đề banner"
                      />
                        {formik.touched.title && formik.errors.title && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phụ đề
                      </label>
                      <input
                        type="text"
                          name="subtitle"
                          value={formik.values.subtitle}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Nhập phụ đề banner"
                      />
                        {formik.touched.subtitle && formik.errors.subtitle && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.subtitle}</div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Enter banner description"
                      />
                        {formik.touched.description && formik.errors.description && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          Đường dẫn ảnh
                      </label>
                      <input
                        type="text"
                          name="image"
                          value={formik.values.image}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          placeholder="Nhập đường dẫn ảnh"
                      />
                        {formik.touched.image && formik.errors.image && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                          name="button_text"
                          value={formik.values.button_text}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., Shop Now"
                      />
                        {formik.touched.button_text && formik.errors.button_text && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.button_text}</div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <input
                        type="text"
                          name="button_link"
                          value={formik.values.button_link}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="e.g., /products"
                      />
                        {formik.touched.button_link && formik.errors.button_link && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.button_link}</div>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vị trí
                      </label>
                      <input
                        type="number"
                          name="position"
                          value={formik.values.position}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        min="1"
                      />
                        {formik.touched.position && formik.errors.position && (
                          <div className="text-red-500 text-sm mt-1">{formik.errors.position}</div>
                        )}
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                            name="is_active"
                            checked={formik.values.is_active}
                            onChange={formik.handleChange}
                          className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                          <span className="ml-2 text-sm text-gray-700">Đang hiển thị</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <button
                        type="submit"
                      className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                        {editingBanner ? 'Cập nhật banner' : 'Tạo banner'}
                    </button>
                    <button
                        type="button"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingBanner(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Đóng
                    </button>
                  </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-center text-red-500 mb-4">
                  <Icons.AlertCircle size={48} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
                  Delete Banner
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDeleteBanner}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setBannerToDelete(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminBannerManagement; 