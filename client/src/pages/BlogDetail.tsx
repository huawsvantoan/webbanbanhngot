import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  author_name?: string;
  view_count?: number;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${id}`);
        setPost(res.data);
      } catch (err: any) {
        setError('Không thể tải bài viết');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent"></div>
        <p className="text-gray-600 mt-4">Đang tải bài viết...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl font-medium mb-4">{error}</div>
        <Link to="/blog" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors">
          Quay lại danh sách
        </Link>
      </div>
    </div>
  );
  
  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 max-w-4xl px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link to="/" className="text-gray-500 hover:text-pink-600 transition-colors">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/blog" className="text-gray-500 hover:text-pink-600 transition-colors">Bài viết</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={getImageUrl(post)}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-gray-500 text-sm mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <span>📅 {new Date(post.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                {post.author_name && (
                  <span>👤 {post.author_name}</span>
                )}
                {post.view_count && (
                  <span>👁️ {post.view_count} lượt xem</span>
                )}
              </div>
              <div className="text-xs">
                Cập nhật: {new Date(post.updated_at).toLocaleDateString('vi-VN')}
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Back to Blog Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                to="/blog" 
                className="inline-flex items-center bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                ← Quay lại danh sách bài viết
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail; 