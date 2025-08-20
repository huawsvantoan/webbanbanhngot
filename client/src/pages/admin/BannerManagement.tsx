import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import { bannerSchema } from '../../validations/bannerSchema';
import { useFormik } from 'formik';
import { 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner, 
  toggleBannerActive,
  Banner,
  CreateBannerData
} from '../../services/bannerService';

// Thư viện ảnh có sẵn
const imageLibrary = [
  { name: 'Bánh Kem 1', url: '/images/banner1.avif', category: 'bánh kem' },
  { name: 'Bánh Kem 2', url: '/images/banner2.avif', category: 'bánh kem' },
  { name: 'Bánh Kem 3', url: '/images/banner3.avif', category: 'bánh kem' },
  { name: 'Bánh Kem 4', url: '/images/banner4.avif', category: 'bánh kem' },
  { name: 'Bánh Kem 5', url: '/images/banner5.avif', category: 'bánh kem' },
  { name: 'Bánh Mì', url: '/images/banhmi.webp', category: 'bánh mì' },
  { name: 'Bánh Mặc Định', url: '/images/default-cake.jpg', category: 'mặc định' },
];

const AdminBannerManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Thêm hàm xử lý upload file đơn giản
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh!');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File ảnh không được lớn hơn 5MB!');
      return;
    }
    
    try {
      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload file lên server sử dụng API service
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const result = await response.json();
      console.log('Upload result:', result); // Debug log
      
      // Cập nhật đường dẫn ảnh trong form
      formik.setFieldValue('image_url', result.image_url);
      toast.success('Upload ảnh thành công!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload ảnh thất bại!');
    }
  };

  // Form state
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      image_url: '',
      position: banners.length > 0 ? Math.max(...banners.map(b => b.position)) + 1 : 1,
      is_active: 1,
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

  // Cập nhật vị trí mặc định khi banners thay đổi
  useEffect(() => {
    if (banners.length > 0 && !editingBanner) {
      const maxPosition = Math.max(...banners.map(b => b.position));
      formik.setFieldValue('position', maxPosition + 1);
    }
  }, [banners, editingBanner]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải banners');
      toast.error('Không thể tải banners');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBanner = async (values: CreateBannerData) => {
    try {
      await createBanner(values);
      toast.success('Tạo banner thành công');
      setShowCreateModal(false);
      resetForm();
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tạo banner thất bại');
    }
  };

  const handleUpdateBanner = async (values: Partial<CreateBannerData>) => {
    if (!editingBanner) return;
    try {
      await updateBanner(editingBanner.id, values);
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
      await deleteBanner(bannerToDelete.id);
      toast.success('Banner đã được xóa thành công');
      setShowDeleteModal(false);
      setBannerToDelete(null);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa banner thất bại');
    }
  };

  const handleEditClick = (banner: Banner) => {
    setEditingBanner(banner);
    formik.setValues({
      title: banner.title,
      description: banner.description,
      image_url: banner.image_url,
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
      await toggleBannerActive(banner.id, !banner.is_active);
      toast.success(`Banner ${banner.is_active ? 'đã ẩn' : 'đã hiển thị'} thành công`);
      fetchBanners();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật trạng thái banner thất bại');
    }
  };

  const handleRestore = async (banner: Banner) => {
    try {
      const response = await fetch(`http://localhost:5000/api/banners/admin/${banner.id}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        toast.success('Banner đã được khôi phục thành công');
        fetchBanners();
      } else {
        toast.error('Khôi phục banner thất bại');
      }
    } catch (err: any) {
      toast.error('Lỗi khi khôi phục banner');
    }
  };

  const handleHardDelete = async (banner: Banner) => {
    if (window.confirm(`Bạn có chắc muốn xóa VĨNH VIỄN banner "${banner.title}"? Hành động này không thể hoàn tác!`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/banners/admin/${banner.id}/hard`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          toast.success('Banner đã được xóa vĩnh viễn');
          fetchBanners();
        } else {
          toast.error('Xóa banner thất bại');
        }
      } catch (err: any) {
        toast.error('Lỗi khi xóa banner');
      }
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
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Lỗi</h2>
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
              <h1 className="text-3xl font-bold text-gray-800">Quản Lý Banner</h1>
              <p className="text-gray-600 mt-2">Tạo và quản lý banner trang chủ</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
              >
                <Icons.Plus size={20} />
                + Tạo Banner
              </button>
            </div>
          </div>
        </motion.div>

        {/* Banners List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col ${
                banner.isDeleted === 1 ? 'opacity-60' : ''
              }`}
            >
              <div className="relative h-52 bg-gray-100">
                <img
                  src={banner.image_url ? `${process.env.REACT_APP_API_URL || ''}${banner.image_url}` : '/images/banner1.avif'}
                  alt={banner.title}
                  className="w-full h-full object-cover rounded-t-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/banner1.avif';
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-t-2xl"></div>
                {/* Badge trạng thái */}
                <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md backdrop-blur-sm ${
                    banner.is_active 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-gray-400/80 text-white'
                  }`}>
                    {banner.is_active ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-pink-500/90 text-white shadow-md backdrop-blur-sm">
                    Vị trí {banner.position}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Ẩn tiêu đề và mô tả trong danh sách banner */}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {banner.isDeleted === 1 ? (
                    <>
                      <button
                        onClick={() => handleRestore(banner)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-1 font-semibold shadow-md"
                      >
                        <Icons.RefreshCcw size={16} />
                        Khôi phục
                      </button>
                      <button
                        onClick={() => handleHardDelete(banner)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-semibold shadow-md flex items-center justify-center"
                        title="Xóa vĩnh viễn"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(banner)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 font-semibold shadow-md"
                      >
                        <Icons.FolderOpen size={16} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleToggleActive(banner)}
                        className={`px-4 py-2 rounded-full font-semibold shadow-md flex items-center justify-center transition-colors duration-200 ${
                          banner.is_active
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
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
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-semibold shadow-md flex items-center justify-center"
                        title="Xóa mềm (có thể khôi phục)"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </>
                  )}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy banner nào</h3>
            <p className="text-gray-600">Tạo banner đầu tiên để bắt đầu.</p>
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
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                    {editingBanner ? 'Sửa Banner' : 'Tạo Banner Mới'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingBanner(null);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Icons.X size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={formik.handleSubmit}>
                  <div className="space-y-4">
                    {/* Ẩn các trường Tiêu đề và Mô tả theo yêu cầu */}



                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Đường dẫn ảnh
                        </label>
                        <div className="space-y-2">
                          {/* Input đường dẫn */}
                          <input
                            type="text"
                              name="image_url"
                              value={formik.values.image_url}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                              placeholder="Nhập đường dẫn ảnh"
                          />
                          
                          {/* Nút Upload đơn giản */}
                          <div>
                            <button
                              type="button"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                              <Icons.Upload size={16} />
                              Upload Ảnh
                            </button>
                          </div>
                          
                          {/* Hidden file input */}
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleFileUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </div>
                          {formik.touched.image_url && formik.errors.image_url && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.image_url}</div>
                          )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
                                checked={formik.values.is_active === 1}
                                onChange={e => formik.setFieldValue('is_active', e.target.checked ? 1 : 0)}
                              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                            />
                              <span className="ml-2 text-sm text-gray-700">Đang hiển thị</span>
                          </label>
                        </div>
                      </div>

                      {/* Preview ảnh đơn giản */}
                      {formik.values.image_url && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview Ảnh
                          </label>
                          <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                            <img
                              src={formik.values.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/default-cake.jpg';
                              }}
                            />
                          </div>
                        </div>
                      )}
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
                  Xóa Banner
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Bạn có chắc chắn muốn xóa "{bannerToDelete?.title}"? 
                  <br />
                  <span className="text-blue-600 font-medium">Banner sẽ được xóa mềm và có thể khôi phục sau.</span>
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDeleteBanner}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setBannerToDelete(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Hủy
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