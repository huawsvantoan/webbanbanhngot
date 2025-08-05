import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    image: '',
    status: 'draft' as BlogPost['status']
  });

  // Thêm state cho lỗi validate
  const [formErrors, setFormErrors] = useState<any>({});

  // Callback functions để tránh re-render
  const handleContentChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/blog?includeDeleted=true');
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
    
    // Validate title
    if (!formData.title || formData.title.trim().length < 5) {
      errors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
    }
    
    // Validate content - xử lý HTML content
    const contentText = formData.content ? formData.content.replace(/<[^>]*>/g, '').trim() : '';
    if (!contentText || contentText.length === 0) {
      errors.content = 'Nội dung không được để trống';
    } else if (contentText.length < 10) {
      errors.content = 'Nội dung phải có ít nhất 10 ký tự';
    }
    
    return errors;
  };

  const handleCreatePost = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        image: formData.image, // Chỉ sử dụng image
        status: formData.status
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
        title: formData.title.trim(),
        content: formData.content.trim(),
        image: formData.image, // Chỉ sử dụng image
        status: formData.status
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
      image: post.image || post.image_url || '', // Ưu tiên image, fallback về image_url
      status: post.status
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
      image: '',
      status: 'draft'
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
    
    const formData = new FormData();
    formData.append('image', file);
         try {
       const res = await api.post('/upload', formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
       });
       setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
       toast.success('Tải ảnh lên thành công!');
     } catch (err) {
       console.error('Upload error:', err);
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
              className={`bg-white rounded-lg shadow-md overflow-hidden ${Number(post.isDeleted) === 1 ? 'opacity-60 bg-red-50' : ''}`}
            >
              <div className="relative">
                <img
                  src={post.image ? (post.image.startsWith('http') ? post.image : `http://localhost:5000${post.image}`) : '/images/default-cake.jpg'}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/default-cake.jpg';
                  }}
                />
                {Number(post.isDeleted) === 1 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Đã xóa
                  </div>
                )}
              </div>
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
                <div className="text-gray-600 text-sm mb-4 line-clamp-3" 
                    dangerouslySetInnerHTML={{ 
                      __html: post.excerpt ? 
                        (post.excerpt.length > 150 ? 
                          post.excerpt.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
                          post.excerpt) : 
                        (post.content ? 
                          post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
                          'Không có tóm tắt') 
                    }} 
                />
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
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingPost ? 'Sửa bài viết' : 'Tạo bài viết mới'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Icons.X size={24} />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-lg"
                        placeholder="Nhập tiêu đề bài viết"
                      />
                      {formErrors.title && <div className="text-red-500 text-sm mt-1">{formErrors.title}</div>}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Ảnh bài viết</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {formData.image ? (
                          <div>
                                                         <img
                               src={formData.image ? (formData.image.startsWith('http') ? formData.image : `http://localhost:5000${formData.image}`) : '/images/default-cake.jpg'}
                               alt="Preview"
                               className="w-full max-w-xs h-48 object-cover rounded mb-4 mx-auto"
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.src = '/images/default-cake.jpg';
                               }}
                             />
                            <button
                              onClick={() => setFormData({ ...formData, image: '' })}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Icons.Image className="mx-auto text-gray-400 mb-2" size={48} />
                            <p className="text-gray-600 mb-2">Kéo thả ảnh vào đây hoặc click để chọn</p>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                      </div>
                    </div>

                     {/* Content */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Nội dung *
                       </label>
                       <ReactQuill
                         value={formData.content}
                         onChange={handleContentChange}
                         placeholder="Nhập nội dung bài viết..."
                         modules={{
                           toolbar: [
                             [{ 'header': [1, 2, 3, false] }],
                             ['bold', 'italic', 'underline', 'strikethrough'],
                             ['link', 'image'],
                             [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                             [{ 'indent': '-1'}, { 'indent': '+1' }],
                             [{ 'color': [] }, { 'background': [] }],
                             [{ 'align': [] }],
                             ['blockquote', 'code-block'],
                             ['clean']
                           ]
                         }}
                         formats={[
                           'header',
                           'bold', 'italic', 'underline', 'strikethrough',
                           'link', 'image',
                           'list', 'bullet',
                           'indent',
                           'color', 'background',
                           'align',
                           'blockquote', 'code-block'
                         ]}
                         theme="snow"
                         className="quill-editor"
                         style={{ height: '300px' }}
                       />
                       {formErrors.content && <div className="text-red-500 text-sm mt-1">{formErrors.content}</div>}
                     </div>

                     {/* Status */}
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Trạng thái
                       </label>
                       <select
                         value={formData.status}
                         onChange={(e) => setFormData({ ...formData, status: e.target.value as BlogPost['status'] })}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                       >
                         <option value="draft">Bản nháp</option>
                         <option value="published">Đã đăng</option>
                         <option value="archived">Đã lưu trữ</option>
                       </select>
                     </div>
                  </div>
                </div>

                {/* Footer - Fixed at bottom */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="text-sm text-gray-600">
                    {editingPost ? 'Chỉnh sửa bài viết hiện tại' : 'Tạo bài viết mới cho blog'}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingPost(null);
                        resetForm();
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={editingPost ? handleUpdatePost : handleCreatePost}
                      className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
                    >
                      {editingPost ? 'Cập nhật bài viết' : 'Tạo bài viết'}
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
                <div className="flex items-center justify-center text-orange-500 mb-4">
                  <Icons.AlertCircle size={48} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Xác nhận xóa bài viết
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Bạn có chắc chắn muốn xóa bài viết <b>"{postToDelete?.title}"</b>?
                  <br />
                  <span className="text-orange-600 font-semibold">Bài viết sẽ được chuyển vào thùng rác.</span>
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPostToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
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
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-center text-red-500 mb-4">
                  <Icons.AlertCircle size={48} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-red-600 text-center">
                  Xác nhận xóa vĩnh viễn
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Bạn có chắc chắn muốn <b>xóa vĩnh viễn</b> bài viết <b>"{postToPermanentDelete.title}"</b>? 
                  <br />
                  <span className="text-red-600 font-semibold">Hành động này không thể hoàn tác!</span>
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowPermanentDeleteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handlePermanentDeleteConfirm}
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors font-medium"
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