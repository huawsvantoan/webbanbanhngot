import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts } from '../features/products/productSlice';
import { RootState } from '../store';
import { Product } from '../services/productService';
import { motion } from 'framer-motion';
import { Icons } from '../components/icons';
import Banner from '../components/Banner';
import { CartIconRef } from '../components/Header';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CAKE_IMAGE = '/images/default-cake.jpg';

// Interface cho blog posts
interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  image_url?: string;
  status: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  view_count: number;
}

const categoriesData = [
  { id: 1, name: 'Bánh Mì', items: 320, icon: Icons.ShoppingBag, bgColor: 'bg-green-100', iconColor: 'text-green-600', percent: '35%' },
  { id: 2, name: 'Bánh Ngọt', items: 85, icon: Icons.ShoppingCart, bgColor: 'bg-pink-100', iconColor: 'text-pink-600', percent: '20%' },
  { id: 3, name: 'Bánh Quy', items: 548, icon: Icons.Package, bgColor: 'bg-blue-100', iconColor: 'text-blue-600', percent: '15%' },
  { id: 4, name: 'Socola', items: 48, icon: Icons.Heart, bgColor: 'bg-purple-100', iconColor: 'text-purple-600', percent: '30%' },
  { id: 5, name: 'Bánh Tổng Hợp', items: 50, icon: Icons.Gift, bgColor: 'bg-yellow-100', iconColor: 'text-yellow-600', percent: '10%' },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state: RootState) => state.products);
  const imgRefs = React.useRef<(HTMLImageElement | null)[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State cho blog posts
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
    fetchBlogPosts();
  }, [dispatch]);

  // Fetch blog posts từ API
  const fetchBlogPosts = async () => {
    try {
      setBlogLoading(true);
      const response = await api.get('/blog/public');
      setBlogPosts(response.data || []);
      setBlogError(null);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setBlogError('Không thể tải bài viết');
      // Fallback to dummy data if API fails
      setBlogPosts([
    {
      id: 1,
          title: 'Công thức làm bánh Tiramisu truyền thống',
          content: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
          excerpt: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
      image: '/images/blog-1.jpg',
          status: 'published',
          author_id: 1,
          author_name: 'Chef Master',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ['tiramisu', 'công thức'],
          view_count: 150
    },
    {
      id: 2,
          title: 'Bí quyết làm bánh Croissant giòn rụm',
          content: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
          excerpt: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
      image: '/images/blog-2.jpg',
          status: 'published',
          author_id: 1,
          author_name: 'Chef Master',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ['croissant', 'bánh mì'],
          view_count: 120
    },
    {
      id: 3,
          title: 'Cách làm bánh kem sinh nhật đẹp mắt',
          content: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
          excerpt: 'Khám phá những bí quyết làm bánh độc đáo và công thức nấu ăn mới nhất từ các chuyên gia ẩm thực hàng đầu.',
      image: '/images/blog-3.jpg',
          status: 'published',
          author_id: 1,
          author_name: 'Chef Master',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tags: ['bánh kem', 'sinh nhật'],
          view_count: 200
        }
      ]);
    } finally {
      setBlogLoading(false);
    }
  };

  // Helper function để format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
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

  const handleAddToCart = async (productId: number, imgElement: HTMLImageElement | null) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Animation
    if (imgElement && CartIconRef.current) {
      const imgRect = imgElement.getBoundingClientRect();
      const cartRect = CartIconRef.current.getBoundingClientRect();
      const flyingImg = imgElement.cloneNode(true) as HTMLImageElement;
      flyingImg.style.position = 'fixed';
      flyingImg.style.left = imgRect.left + 'px';
      flyingImg.style.top = imgRect.top + 'px';
      flyingImg.style.width = imgRect.width + 'px';
      flyingImg.style.height = imgRect.height + 'px';
      flyingImg.style.transition = 'all 0.9s cubic-bezier(.4,2,.6,1)';
      flyingImg.style.zIndex = '9999';
      flyingImg.style.pointerEvents = 'none';
      document.body.appendChild(flyingImg);
      setTimeout(() => {
        const cartCenterX = cartRect.left + cartRect.width / 2;
        const cartCenterY = cartRect.top + cartRect.height / 2;
        flyingImg.style.left = cartCenterX - imgRect.width / 8 + 'px';
        flyingImg.style.top = cartCenterY - imgRect.height / 8 + 'px';
        flyingImg.style.width = imgRect.width / 4 + 'px';
        flyingImg.style.height = imgRect.height / 4 + 'px';
        flyingImg.style.opacity = '0.7';
      }, 10);
      setTimeout(() => {
        flyingImg.remove();
      }, 950);
    }
    try {
      await api.post('/cart', { productId, quantity: 1 });
    } catch (err) {
      // ...
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-yellow-50">
      {/* Main Banner/Hero Section */}
      <Banner />

      {/* Categories Section - Enhanced */}
      <section className="py-24 bg-gradient-to-r from-pink-50 to-purple-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-200 rounded-full opacity-25 animate-ping"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Icons.ShoppingBag className="text-white" size={32} />
              </div>
            </motion.div>
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Khám phá các loại bánh ngọt thơm ngon được chế biến từ những nguyên liệu tươi ngon nhất
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categoriesData.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <Link
                  to={`/products?category=${category.name}`}
                  className="group block relative"
                >
                  <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100 hover:border-pink-200 relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-ping"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 animate-ping"></div>
                    
                    <div className="relative z-10">
                      <span className={`absolute top-4 right-4 text-sm font-bold ${category.iconColor} bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm`}>
                    {category.percent}
                  </span>
                      
                      <div className={`w-20 h-20 rounded-3xl ${category.bgColor} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                        <category.icon size={40} className={`${category.iconColor} transform group-hover:scale-110 transition-transform duration-500`} />
                  </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                      <p className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors duration-300 font-medium">
                    {category.items} sản phẩm
                  </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Hot Products - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-white via-pink-50 to-yellow-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-10 animate-spin-slow"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-15 animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Icons.Star className="text-white" size={36} />
              </div>
            </motion.div>
            <h2 className="text-6xl font-extrabold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-6">
              Sản Phẩm Hot
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Những sản phẩm được yêu thích nhất với hương vị độc đáo và chất lượng tuyệt hảo
            </p>
          </motion.div>

          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block animate-spin rounded-full h-24 w-24 border-4 border-pink-600 border-t-transparent shadow-lg"></div>
              <p className="text-gray-600 mt-8 text-xl font-medium">Đang tải sản phẩm hot...</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:border-pink-200 transition-all duration-500 relative">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Hot badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                        🔥 HOT
                      </div>
                    </div>
                    
                    {/* Discount badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                        -15%
                      </div>
                    </div>
                    
                  <div className="relative overflow-hidden">
                    <img
                      ref={el => imgRefs.current[index] = el}
                      src={
                        product.image_url
                          ? product.image_url.startsWith('http')
                            ? product.image_url
                            : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url.startsWith('/') ? '' : '/uploads/'}${product.image_url}`
                          : DEFAULT_CAKE_IMAGE
                      }
                      alt={product.name || ''}
                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Action buttons overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full p-4 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                        onClick={() => handleAddToCart(product.id, imgRefs.current[index])}
                      >
                        <Icons.ShoppingCart size={20} />
                        </motion.button>
                        <Link to={`/products/${product.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-white text-gray-800 rounded-full p-4 hover:bg-gray-100 transition-all duration-300 shadow-lg"
                          >
                        <Icons.ArrowRight size={20} />
                          </motion.div>
                      </Link>
                    </div>
                  </div>
                    
                    <div className="p-8 text-center relative">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 truncate group-hover:text-pink-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                      <p className="text-gray-500 text-sm mb-4 font-medium">Category: {product.category_name}</p>
                      <div className="flex justify-center items-center space-x-3">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">${(product.price * 1.15).toFixed(2)}</span>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex justify-center items-center mt-4 space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icons.Star key={star} size={16} className="text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">(4.9)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section 2 - Enhanced */}
      <section className="relative bg-cover bg-center py-32 lg:py-40 overflow-hidden" style={{ backgroundImage: 'url(/images/banner2.avif)' }}>
        {/* Enhanced overlay with gradient - lighter for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40"></div>
        
        {/* Additional decorative overlay for texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-pink-400/20"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-16 h-16 bg-pink-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-1/2 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-35 animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-pink-300 rounded-full opacity-25 animate-spin-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
                <Icons.Gift className="text-white" size={40} />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg"
            >
              Bánh Mới Nhất
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Trong Tuần
              </span>
          </motion.h2>
            
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
              className="text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-95 font-medium drop-shadow-md"
          >
              Khám phá những chiếc bánh ngọt mới nhất được làm thủ công với tình yêu và sự tỉ mỉ, hoàn hảo cho mọi dịp đặc biệt.
          </motion.p>
            
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
          >
                <Link to="/products" className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-2xl transform hover:scale-105 backdrop-blur-sm">
              Khám Phá Ngay
            </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/about" className="inline-block bg-white/25 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold hover:bg-white/35 transition-all duration-300 border border-white/40 shadow-lg">
                  Tìm Hiểu Thêm
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Special Cakes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Đặc Sản Bánh Ngọt</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Khám phá những hương vị độc đáo được chế biến từ công thức truyền thống</p>
          </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              className="bg-pink-50 p-8 rounded-2xl shadow-lg border border-pink-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-pink-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Icons.Heart className="text-pink-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bánh Tiramisu</h3>
              <p className="text-gray-700 text-sm mb-4">Hương vị đậm đà với lớp kem mascarpone mịn màng, bánh ladyfinger thấm đẫm cà phê Ý, phủ bột cacao đắng ngọt.</p>
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                <span>⭐ 4.9/5</span>
                <span>•</span>
                <span>Bán chạy nhất</span>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              className="bg-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-blue-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Icons.Star className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Croissant Pháp</h3>
              <p className="text-gray-700 text-sm mb-4">Lớp vỏ giòn rụm, bên trong mềm mịn với hương vị bơ thơm béo đặc trưng. Được làm theo công thức truyền thống Pháp.</p>
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                <span>⭐ 4.8/5</span>
                <span>•</span>
                <span>Bán sáng</span>
              </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              className="bg-yellow-50 p-8 rounded-2xl shadow-lg border border-yellow-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="w-24 h-24 rounded-full mx-auto mb-6 bg-yellow-200 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Icons.Gift className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bánh Kem Sinh Nhật</h3>
              <p className="text-gray-700 text-sm mb-4">Kem tươi mát lạnh, bánh bông lan mềm mịn, trang trí đẹp mắt với hoa quả tươi và chocolate. Hoàn hảo cho mọi dịp.</p>
              <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                <span>⭐ 4.9/5</span>
                <span>•</span>
                <span>Đặt theo yêu cầu</span>
              </div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Baking Process Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Quy Trình Làm Bánh</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Cam kết chất lượng từ khâu chọn nguyên liệu đến thành phẩm cuối cùng</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icons.ShoppingBag size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chọn Nguyên Liệu</h3>
              <p className="text-gray-600 text-sm">Sử dụng 100% nguyên liệu tươi ngon, bơ Pháp, trứng gà ta, bột mì cao cấp nhập khẩu.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icons.Heart size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Làm Bằng Tâm</h3>
              <p className="text-gray-600 text-sm">Mỗi chiếc bánh được làm thủ công với tình yêu và sự tỉ mỉ, đảm bảo hương vị hoàn hảo.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icons.Gift size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Kiểm Soát Chất Lượng</h3>
              <p className="text-gray-600 text-sm">Quy trình kiểm tra nghiêm ngặt từ khâu chuẩn bị đến đóng gói, đảm bảo an toàn vệ sinh.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icons.Star size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Giao Hàng Tươi</h3>
              <p className="text-gray-600 text-sm">Bánh được làm mới mỗi ngày và giao hàng trong vòng 2 giờ để đảm bảo độ tươi ngon.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Enhanced */}
      <section className="py-20 bg-cover bg-center text-white relative overflow-hidden" style={{ backgroundImage: 'url(/images/banner3.avif)' }}>
        {/* Enhanced overlay with gradient - lighter for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/60 via-purple-600/50 to-pink-500/60"></div>
        
        {/* Additional decorative overlay for texture */}
        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 via-transparent to-black/20"></div>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/15 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/20 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/12 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-pink-300/20 rounded-full animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border border-white/20">
                <Icons.ShoppingCart className="text-white" size={28} />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-extrabold mb-4 drop-shadow-lg"
            >
              Khám Phá Hương Vị
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 drop-shadow-md">
                Bánh Ngọt Tuyệt Hảo!
              </span>
          </motion.h2>
            
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
              className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto opacity-95 leading-relaxed font-medium drop-shadow-md"
          >
              Thưởng thức những chiếc bánh thơm ngon được làm thủ công với nguyên liệu tươi ngon nhất. Đặt hàng ngay để nhận ưu đãi đặc biệt!
          </motion.p>
            
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/products" className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105 backdrop-blur-sm">
                  Xem Sản Phẩm
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/contact" className="inline-block bg-white/25 backdrop-blur-md text-white px-6 py-3 rounded-full font-semibold text-base hover:bg-white/35 transition-all duration-300 border border-white/40 shadow-lg">
                  Liên Hệ
            </Link>
              </motion.div>
            </motion.div>
            
            {/* Special offer badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="mt-8 inline-block"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-base shadow-xl animate-pulse backdrop-blur-sm border border-yellow-300/30">
                🎉 Bánh tươi mỗi ngày - Đặt trước 2h!
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-white to-pink-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-purple-200 rounded-full opacity-15 animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Icons.Package className="text-white" size={36} />
              </div>
            </motion.div>
            <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Bài Viết Mới Nhất
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Cập nhật những công thức nấu ăn, xu hướng ẩm thực và bí quyết làm bánh mới nhất
            </p>
          </motion.div>

                     {blogLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20"
             >
               <div className="inline-block animate-spin rounded-full h-24 w-24 border-4 border-blue-600 border-t-transparent shadow-lg"></div>
               <p className="text-gray-600 mt-8 text-xl font-medium">Đang tải bài viết...</p>
             </motion.div>
           ) : blogError ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20"
             >
               <div className="text-red-500 text-xl font-medium mb-4">{blogError}</div>
               <button 
                 onClick={fetchBlogPosts}
                 className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
               >
                 Thử lại
               </button>
             </motion.div>
           ) : blogPosts.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-center py-20"
             >
               <div className="text-gray-500 text-xl font-medium">Chưa có bài viết nào</div>
             </motion.div>
           ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {blogPosts.slice(0, 3).map((post, index) => (
              <motion.div
                key={post.id}
                   initial={{ opacity: 0, y: 50, scale: 0.8 }}
                   whileInView={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true }}
                   whileHover={{ y: -10, scale: 1.02 }}
                   className="group relative"
              >
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
                       <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-relaxed">
                    {post.title}
                  </h3>
                       
                       <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                         {post.excerpt}
                       </p>
                       
                  <Link
                         to={`/blog/${post.id}`}
                         className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 group/link"
                  >
                    Đọc Thêm
                         <Icons.ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform duration-300" size={18} />
                  </Link>
                     </div>
                </div>
              </motion.div>
            ))}
          </div>
           )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/blog" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-xl">
              Xem Tất Cả Bài Viết
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 