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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/blog/public');
        setPosts(res.data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Helper function để format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Icons.Package className="text-white" size={36} />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Bài Viết Mới Nhất
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Cập nhật những công thức nấu ăn, xu hướng ẩm thực và bí quyết làm bánh mới nhất
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16">
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
                          {post.excerpt || createExcerpt(post.content)}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span className="flex items-center">
                            <Icons.Clock className="mr-1" size={14} />
                            {formatDate(post.created_at)}
                          </span>
                          {post.view_count && (
                            <span className="flex items-center">
                              <Icons.Eye className="mr-1" size={14} />
                              {post.view_count}
                            </span>
                          )}
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
    </div>
  );
};

export default Blog; 