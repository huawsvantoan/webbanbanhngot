import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../icons';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number | null;
  content?: string;
  parent_id?: number | null;
  created_at: string;
  user: {
    id: number;
    username: string;
    full_name?: string;
  };
  replies?: Review[];
}

interface ReviewsProps {
  productId: number;
  currentUserId?: number;
  isAdmin?: boolean;
}

const Reviews: React.FC<ReviewsProps> = ({ productId, currentUserId, isAdmin = false }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [replyingTo, setReplyingTo] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    rating: 5 as number | null,
    content: '',
    parent_id: null as number | null,
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${productId}/reviews`);
      setReviews(response.data.reviews);
      setAverageRating(response.data.averageRating);
      setRatingCount(response.data.ratingCount);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = { ...formData };
      if (payload.rating === 0) {
        payload.rating = null;
      }

      if (editingReview) {
        await api.put(`/reviews/${editingReview.id}`, payload);
        toast.success('Cập nhật thành công!');
        setEditingReview(null);
      } else {
        if (replyingTo) {
          payload.parent_id = replyingTo.id;
          payload.rating = null;
        }
        await api.post(`/products/${productId}/reviews`, payload);
        toast.success(replyingTo ? 'Phản hồi đã được gửi!' : 'Đánh giá đã được gửi!');
        setReplyingTo(null);
      }
      
      setShowReviewForm(false);
      setFormData({ rating: 5, content: '', parent_id: null });
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gửi đánh giá/bình luận thất bại!');
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReplyingTo(null);
    setFormData({
      rating: review.rating,
      content: review.content || '',
      parent_id: review.parent_id || null,
    });
    setShowReviewForm(true);
  };

  const handleReplyToReview = (review: Review) => {
    setReplyingTo(review);
    setEditingReview(null);
    setFormData({
      rating: null,
      content: '',
      parent_id: review.id,
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá/bình luận này?')) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success('Đánh giá/bình luận đã được xóa!');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xóa đánh giá/bình luận thất bại!');
    }
  };

  const canEditReview = (review: Review) => {
    return currentUserId === review.user_id || isAdmin;
  };

  const renderStars = (rating: number | null) => {
    const displayRating = rating === null ? 0 : rating;
    return Array.from({ length: 5 }, (_, i) => (
      <Icons.Star
        key={i}
        className={`w-4 h-4 ${i < displayRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Đánh giá & Bình luận khách hàng</h3>
          {currentUserId && !showReviewForm && (
            <button
              onClick={() => {
                setShowReviewForm(true);
                setReplyingTo(null);
                setFormData({ rating: 5, content: '', parent_id: null });
              }}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Viết đánh giá/bình luận
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {renderStars(Math.round(averageRating))}
            <span className="text-lg font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-gray-600">({ratingCount} đánh giá)</span>
        </div>
      </div>

      {/* Review/Comment Form */}
      <AnimatePresence>
        {(showReviewForm || replyingTo) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h4 className="text-lg font-semibold mb-4">
              {editingReview ? 'Chỉnh sửa đánh giá' :
               replyingTo ? `Trả lời ${replyingTo.user.full_name || replyingTo.user.username}` :
               'Viết đánh giá/bình luận'}
            </h4>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {!replyingTo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá (sao)</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Icons.Star
                          className={`w-6 h-6 ${
                            star <= Number(formData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={4}
                  placeholder={replyingTo ? 'Viết phản hồi của bạn...' : 'Chia sẻ trải nghiệm của bạn về sản phẩm này...'}
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {editingReview ? 'Cập nhật' : (replyingTo ? 'Gửi phản hồi' : 'Gửi đánh giá')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setEditingReview(null);
                    setReplyingTo(null); // Clear replying state on cancel
                    setFormData({ rating: 5, content: '', parent_id: null });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews/Comments List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có đánh giá hoặc bình luận nào. Hãy là người đầu tiên!
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              currentUserId={currentUserId} 
              isAdmin={isAdmin}
              handleEditReview={handleEditReview}
              handleDeleteReview={handleDeleteReview}
              handleReplyToReview={handleReplyToReview}
              renderStars={renderStars}
              canEditReview={canEditReview}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface ReviewItemProps {
  review: Review;
  currentUserId?: number;
  isAdmin?: boolean;
  handleEditReview: (review: Review) => void;
  handleDeleteReview: (reviewId: number) => void;
  handleReplyToReview: (review: Review) => void;
  renderStars: (rating: number | null) => JSX.Element[];
  canEditReview: (review: Review) => boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  currentUserId,
  isAdmin,
  handleEditReview,
  handleDeleteReview,
  handleReplyToReview,
  renderStars,
  canEditReview,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Icons.User className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {review.user.full_name || review.user.username}
            </p>
            <div className="flex items-center space-x-2">
              {review.rating !== null && renderStars(review.rating)}
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {currentUserId && (
          <div className="flex space-x-2">
            {canEditReview(review) && (
              <button
                onClick={() => handleEditReview(review)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                <Icons.FolderOpen size={16} />
              </button>
            )}
            {canEditReview(review) && (
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                <Icons.Trash2 size={16} />
              </button>
            )}
            {currentUserId && (
              <button
                onClick={() => handleReplyToReview(review)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Trả lời
              </button>
            )}
          </div>
        )}
      </div>
      
      {review.content && (
        <p className="mt-3 text-gray-700">{review.content}</p>
      )}

      {review.replies && review.replies.length > 0 && (
        <div className="ml-10 mt-4 space-y-4 border-l pl-4 border-gray-200">
          {review.replies.map((reply) => (
            <ReviewItem 
              key={reply.id} 
              review={reply} 
              currentUserId={currentUserId} 
              isAdmin={isAdmin}
              handleEditReview={handleEditReview}
              handleDeleteReview={handleDeleteReview}
              handleReplyToReview={handleReplyToReview}
              renderStars={renderStars}
              canEditReview={canEditReview}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Reviews; 