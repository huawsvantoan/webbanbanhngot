import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Icons } from '../../components/icons';
import { toast } from 'react-hot-toast';

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_name: string;
  product_name: string;
  product_image?: string;
}

const AdminReviews: React.FC = () => {
  const { isAdmin } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải đánh giá');
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: number, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/admin/reviews/${reviewId}/status`, { status });
      setReviews(reviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      ));
      toast.success(status === 'approved' ? 'Duyệt đánh giá thành công' : 'Từ chối đánh giá thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật trạng thái đánh giá thất bại');
    }
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    try {
      await api.delete(`/admin/reviews/${reviewToDelete.id}`);
      setReviews(reviews.filter(r => r.id !== reviewToDelete.id));
      toast.success('Xóa đánh giá thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xóa đánh giá thất bại');
    } finally {
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (review.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (review.content?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Quản lý đánh giá</h1>
          <p className="text-gray-600 mt-2">Xem và duyệt đánh giá của khách hàng</p>
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
                placeholder="Tìm kiếm đánh giá..."
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
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-start gap-6">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={review.product_image || '/images/default-cake.jpg'}
                    alt={review.product_name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">{review.product_name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(review.status)}`}> 
                        {review.status === 'pending' ? 'Chờ duyệt' : review.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Icons.Star
                          key={i}
                          className={i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                          size={16}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">bởi {review.user_name}</span>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Icons.CheckCircle size={16} />
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Icons.X size={16} />
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteClick(review)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Icons.Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredReviews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Icons.MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đánh giá nào</h3>
              <p className="text-gray-600">Không có đánh giá nào phù hợp với bộ lọc hiện tại.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && reviewToDelete && (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">Xác nhận xóa đánh giá</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xác nhận xóa
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setReviewToDelete(null);
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
    </div>
  );
};

export default AdminReviews; 