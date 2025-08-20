import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../components/icons';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  image?: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  view_count?: number;
  isDraft?: boolean;
  isDeleted?: boolean;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/blog/public?page=${currentPage}&limit=${itemsPerPage}`);
        console.log('Blog API response:', res.data); // Debug log
        if (res.data && Array.isArray(res.data.data)) {
          setPosts(res.data.data || []);
          setTotal(res.data.total || 0);
          setTotalPages(res.data.totalPages || 1);
        } else {
          // Fallback for old API format
          setPosts(res.data || []);
          setTotal(res.data?.length || 0);
          setTotalPages(1);
        }
        console.log('Blog state after update:', { posts: res.data?.data || res.data, total: res.data?.total || res.data?.length, totalPages: res.data?.totalPages || 1 }); // Debug log
        setError(null);
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, itemsPerPage]);

  // Helper function để format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function để strip HTML tags
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function để lấy image URL
  const getImageUrl = (post: BlogPost) => {
    if (post.image_url) {
      return post.image_url.startsWith('http') 
        ? post.image_url 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${post.image_url.startsWith('/') ? '' : '/uploads/'}${post.image_url}`;
    }
    if (post.image) {
      return post.image.startsWith('http') 
        ? post.image 
        : post.image;
    }
    return '/images/default-cake.jpg';
  };

  // Helper function để tạo excerpt từ content
  const createExcerpt = (content: string, maxLength: number = 150) => {
    // Remove HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');
    if (textContent.length <= maxLength) return textContent;
    return textContent.substring(0, maxLength) + '...';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-600 border-t-transparent shadow-lg"></div>
        <p className="text-gray-600 mt-6 text-xl font-medium">Đang tải bài viết...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl font-medium mb-6">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      {/* Header Section */}
      <section className="py-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-16 h-16 bg-pink-100 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-12 h-12 bg-purple-100 rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-yellow-100 rounded-full opacity-25 animate-ping"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Bài Viết Mới Nhất
            </h1>
            
            {/* Decorative line */}
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-500 mx-auto mb-3 rounded-full"></div>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Cập nhật những công thức nấu ăn, xu hướng ẩm thực và bí quyết làm bánh mới nhất
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-500 text-xl font-medium mb-4">Chưa có bài viết nào</div>
              <p className="text-gray-400">Hãy quay lại sau để xem những bài viết mới!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-blue-200">
                      <div className="relative overflow-hidden">
                        <img
                          src={getImageUrl(post)}
                          alt={post.title}
                          className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Date badge */}
                        <div className="absolute top-4 left-4 z-20">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                            {formatDate(post.created_at)}
                          </div>
                        </div>
                        
                        {/* Read more overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full font-semibold shadow-lg"
                          >
                            Đọc Ngay
                          </motion.div>
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-relaxed">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {stripHtmlTags(post.excerpt || createExcerpt(post.content))}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Icons.Clock className="mr-1" size={14} />
                            {formatDate(post.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Pagination Info */}
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} trong tổng số {total} bài viết
              </p>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm'
                  }`}
                >
                  <Icons.ChevronLeft size={16} />
                  Trước
                </button>
                
                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  // First page
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                  }
                  
                  // Middle pages
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === i
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Last page
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 shadow-sm'
                  }`}
                >
                  Sau
                  <Icons.ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog; 