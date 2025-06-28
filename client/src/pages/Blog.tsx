import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
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
        setPosts(res.data);
      } catch (err: any) {
        setError('Không thể tải bài viết');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="py-12 text-center">Đang tải bài viết...</div>;
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bài Viết</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link to={`/blog/${post.id}`} key={post.id} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-4">
            <img src={post.image || '/images/default-cake.jpg'} alt={post.title} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
            <div className="text-xs text-gray-400 mt-2">{new Date(post.created_at).toLocaleDateString('vi-VN')}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blog; 