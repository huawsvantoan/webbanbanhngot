import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  image_url?: string;
  created_at: string;
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
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="py-12 text-center">Đang tải bài viết...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Link to="/blog" className="text-pink-600 hover:underline mb-4 inline-block">← Quay lại danh sách</Link>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={post.image_url ? `${process.env.REACT_APP_API_URL}${post.image_url}` : post.image ? `${process.env.REACT_APP_API_URL}${post.image}` : '/images/default-cake.jpg'}
        alt={post.title}
        className="w-full h-64 object-cover rounded mb-6"
      />
      <div className="text-gray-600 mb-6 whitespace-pre-line">{post.content}</div>
      <div className="text-xs text-gray-400">Ngày đăng: {new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
    </div>
  );
};

export default BlogDetail; 