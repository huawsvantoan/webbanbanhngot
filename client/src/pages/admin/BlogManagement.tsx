import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  image_url?: string;
  status: 'draft' | 'published' | 'archived';
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  view_count: number;
  isDeleted: number;
}

const AdminBlogManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | BlogPost['status']>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [postToPermanentDelete, setPostToPermanentDelete] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    image_url: '',
    status: 'draft' as BlogPost['status'],
    tags: ''
  });

  // Thêm state cho lỗi validate
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/blog');
      setPosts(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog posts');
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Hàm validate dữ liệu form
  const validateForm = () => {
    const errors: any = {};
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    } else if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(formData.title.trim())) {
      errors.title = 'Tiêu đề chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng';
    }
    if (!formData.content || formData.content.trim().length === 0) {
      errors.content = 'Nội dung không được để trống';
    }
    if (formData.excerpt && formData.excerpt.length > 255) {
      errors.excerpt = 'Tóm tắt không được vượt quá 255 ký tự';
    }
    if (
      formData.image &&
      formData.image.length > 0 &&
      !(
        /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(formData.image) ||
        /^\/uploads\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(formData.image)
      )
    ) {
      errors.image = 'Đường dẫn hình ảnh không hợp lệ (phải là URL ảnh hoặc ảnh đã upload)';
    }
    return errors;
  };

  const handleCreatePost = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const postData = {
        ...formData,
        image_url: formData.image || formData.image_url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await api.post('/admin/blog', postData);
      toast.success('Blog post created successfully');
      setShowCreateModal(false);
      resetForm();
      setFormErrors({});
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create blog post');
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const postData = {
        ...formData,
        image_url: formData.image || formData.image_url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      await api.put(`/admin/blog/${editingPost.id}`, postData);
      toast.success('Blog post updated successfully');
      setEditingPost(null);
      resetForm();
      setFormErrors({});
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update blog post');
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await api.delete(`/admin/blog/${postToDelete.id}`);
      toast.success('Blog post deleted successfully');
      setShowDeleteModal(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete blog post');
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image,
      image_url: post.image_url || '',
      status: post.status,
      tags: post.tags.join(', ')
    });
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      image_url: '',
      status: 'draft',
      tags: ''
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await api.put(`/admin/blog/${id}/restore`);
      toast.success('Khôi phục bài viết thành công');
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Khôi phục bài viết thất bại');
    }
  };

  const handlePermanentDeleteClick = (post: BlogPost) => {
    setPostToPermanentDelete(post);
    setShowPermanentDeleteModal(true);
  };

  const handlePermanentDeleteConfirm = async () => {
    if (!postToPermanentDelete) return;
    try {
      await api.delete(`/admin/blog/${postToPermanentDelete.id}/permanent`);
      toast.success('Đã xóa vĩnh viễn bài viết');
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa vĩnh viễn thất bại');
    } finally {
      setShowPermanentDeleteModal(false);
      setPostToPermanentDelete(null);
    }
  };

  // Thêm hàm xử lý upload ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
      toast.success('Tải ảnh lên thành công!');
    } catch (err) {
      toast.error('Tải ảnh lên thất bại!');
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
              <h1 className="text-3xl font-bold text-gray-800">Quản lý bài viết</h1>
              <p className="text-gray-600 mt-2">Tạo và quản lý bài viết blog</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors flex items-center gap-2"
            >
              <Icons.Plus size={20} />
              Thêm bài viết
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Bản nháp</option>
              <option value="published">Đã đăng</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${Number(post.isDeleted) === 1 ? 'opacity-60' : ''}`}
            >
              <img
                src={post.image_url ? `${process.env.REACT_APP_API_URL}${post.image_url}` : post.image ? `${process.env.REACT_APP_API_URL}${post.image}` : '/images/default-blog.jpg'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                    {post.status === 'draft' ? 'Bản nháp' : post.status === 'published' ? 'Đã đăng' : 'Đã lưu trữ'}
                  </span>
                  <span className="text-sm text-gray-500">{post.view_count} lượt xem</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Tác giả: {post.author_name || 'Không rõ'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{post.tags.length - 3} thẻ khác</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {Number(post.isDeleted) === 1 ? (
                    <>
                      <button
                        onClick={() => handleRestore(post.id)}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        title="Khôi phục bài viết này"
                      >
                        <Icons.CheckCircle size={18} />
                        Khôi phục
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteClick(post)}
                        className="flex-1 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center gap-2"
                        title="Xóa vĩnh viễn bài viết này"
                      >
                        <Icons.Trash2 size={18} />
                        Xóa vĩnh viễn
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(post)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icons.FolderOpen size={16} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(post)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        title="Xóa mềm bài viết này"
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

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Icons.MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có bài viết nào</h3>
            <p className="text-gray-600">Hãy tạo bài viết đầu tiên để bắt đầu.</p>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {(showCreateModal || editingPost) && (
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
                    {editingPost ? 'Sửa bài viết' : 'Tạo bài viết mới'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Nhập tiêu đề bài viết"
                      />
                      {formErrors.title && <div className="text-red-500 text-sm mt-1">{formErrors.title}</div>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tóm tắt
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Nhập tóm tắt bài viết"
                      />
                      {formErrors.excerpt && <div className="text-red-500 text-sm mt-1">{formErrors.excerpt}</div>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Nhập nội dung bài viết"
                      />
                      {formErrors.content && <div className="text-red-500 text-sm mt-1">{formErrors.content}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">Ảnh bài viết</label>
                      {formData.image && (
                        <img
                          src={formData.image.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL}${formData.image}` : formData.image}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded mb-2 border"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thẻ (phân cách bằng dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        placeholder="Nhập các thẻ, cách nhau bởi dấu phẩy"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="draft">Bản nháp</option>
                        <option value="published">Đã đăng</option>
                        <option value="archived">Đã lưu trữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <button
                      onClick={editingPost ? handleUpdatePost : handleCreatePost}
                      className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      {editingPost ? 'Cập nhật bài viết' : 'Tạo bài viết'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingPost(null);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
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
                  Xác nhận xóa bài viết
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Bạn có chắc chắn muốn xóa bài viết "{postToDelete?.title}"? Hành động này không thể hoàn tác.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDeletePost}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Xác nhận xóa
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPostToDelete(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal xác nhận xóa vĩnh viễn */}
        <AnimatePresence>
          {showPermanentDeleteModal && postToPermanentDelete && (
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
                className="bg-white rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600">Xác nhận xóa vĩnh viễn</h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn <b>xóa vĩnh viễn</b> bài viết "{postToPermanentDelete.title}"? Hành động này <b>không thể hoàn tác</b>.
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
    </div>
  );
};

export default AdminBlogManagement; 