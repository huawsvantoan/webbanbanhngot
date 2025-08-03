import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types/product';
import { Category } from '../types/category';
import api from '../services/api';
import { CartIconRef } from '../components/Header';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'all' | 'featured' | 'hot'>('all');
  const itemsPerPage = 12;
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products/featured?limit=4');
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      }
    };

    const fetchHotProducts = async () => {
      try {
        const response = await api.get('/products/hot?limit=4');
        setHotProducts(response.data);
      } catch (err) {
        console.error('Error fetching hot products:', err);
      }
    };

    fetchCategories();
    fetchFeaturedProducts();
    fetchHotProducts();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
    setSearchQuery(urlSearch);
    setCurrentPage(1);
  }, [searchParams.get('search')]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategory && { category: selectedCategory.toString() }),
          ...(activeFilter === 'featured' && { featured: 'true' }),
          ...(activeFilter === 'hot' && { hot: 'true' })
        });
        const response = await api.get(`/products?${params}`);
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory, activeFilter]);

  const handleAddToCart = async (productId: number, e: React.MouseEvent, imgElement: HTMLImageElement | null) => {
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
      console.error('Error adding to cart:', err);
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: 'all' | 'featured' | 'hot') => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      setSearchParams({ search: searchTerm.trim() });
    } else {
      setSearchQuery('');
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setActiveFilter('all');
    setSearchTerm('');
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const renderProductCard = (product: Product, index: number, isSpecial: boolean = false) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-pink-200 ${
        isSpecial ? 'ring-2 ring-pink-200' : ''
      }`}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            ref={el => imgRefs.current[index] = el}
            src={
              product.image_url
                ? product.image_url.startsWith('http')
                  ? product.image_url
                  : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url.startsWith('/') ? '' : '/uploads/'}${product.image_url}`
                : '/images/default-cake.jpg'
            }
            alt={product.name || ''}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Nổi Bật
              </div>
            )}
            {product.is_hot && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                HOT
              </div>
            )}
            {product.discount_percent && product.discount_percent > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.discount_percent}%
              </div>
            )}
          </div>

          {/* Rating */}
          {product.rating_avg && product.rating_avg > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Icons.Star className="text-yellow-500" size={12} />
              <span className="text-xs font-semibold text-gray-800">
                {product.rating_avg.toFixed(1)}
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Icons.Eye className="text-gray-700" size={20} />
            </div>
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">Hết Hàng</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-pink-600">
              {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.original_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            )}
          </div>

          {/* View count */}
          {product.view_count && product.view_count > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
              <Icons.Eye size={12} />
              <span>{product.view_count} lượt xem</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="px-6 pb-6">
        <button
          onClick={e => handleAddToCart(product.id, e, imgRefs.current[index])}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
          }`}
        >
          {product.stock === 0 ? 'Hết Hàng' : 'Thêm Vào Giỏ'}
        </button>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Lỗi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-6">

        {/* Category Cards Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              // Define colors and icons for each category
              const getCategoryStyle = (categoryName: string) => {
                const name = categoryName.toLowerCase();
                if (name.includes('bông lan') || name.includes('bánh bông lan')) {
                  return {
                    bgGradient: 'from-orange-100 to-yellow-100',
                    iconBg: 'bg-orange-500',
                    icon: Icons.Package
                  };
                } else if (name.includes('kem') || name.includes('bánh kem')) {
                  return {
                    bgGradient: 'from-pink-100 to-purple-100',
                    iconBg: 'bg-pink-500',
                    icon: Icons.Gift
                  };
                } else if (name.includes('mì') || name.includes('bánh mì')) {
                  return {
                    bgGradient: 'from-amber-100 to-orange-100',
                    iconBg: 'bg-amber-500',
                    icon: Icons.Package
                  };
                } else if (name.includes('ngọt') || name.includes('bánh ngọt')) {
                  return {
                    bgGradient: 'from-purple-100 to-pink-100',
                    iconBg: 'bg-purple-500',
                    icon: Icons.Heart
                  };
                } else if (name.includes('sôcla') || name.includes('socola')) {
                  return {
                    bgGradient: 'from-brown-100 to-orange-100',
                    iconBg: 'bg-brown-500',
                    icon: Icons.CheckCircle
                  };
                } else {
                  // Default style
                  return {
                    bgGradient: 'from-gray-100 to-blue-100',
                    iconBg: 'bg-gray-500',
                    icon: Icons.Package
                  };
                }
              };

              const style = getCategoryStyle(category.name);
              const IconComponent = style.icon;

              return (
                <div 
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer ${
                    selectedCategory === category.id ? 'border-2 border-orange-300' : ''
                  }`}
                >
                  <div className={`aspect-square bg-gradient-to-br ${style.bgGradient} flex items-center justify-center`}>
                    <div className="text-center">
                      <div className={`w-12 h-12 ${style.iconBg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className="text-white" size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-800">{category.name}</p>
                      {category.description && (
                        <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Featured Products Section */}
        {activeFilter === 'all' && featuredProducts.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sản Phẩm Nổi Bật</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những sản phẩm được chọn lọc kỹ lưỡng với hương vị đặc biệt và chất lượng cao
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => renderProductCard(product, index, true))}
            </div>
          </section>
        )}

        {/* Hot Products Section */}
        {activeFilter === 'all' && hotProducts.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Sản Phẩm Bán Chạy</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những sản phẩm được khách hàng yêu thích và mua nhiều nhất
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotProducts.map((product, index) => renderProductCard(product, index, true))}
            </div>
          </section>
        )}

        {/* All Products Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {activeFilter === 'featured' ? 'Sản Phẩm Nổi Bật' : 
               activeFilter === 'hot' ? 'Sản Phẩm Bán Chạy' : 'Tất Cả Sản Phẩm'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {activeFilter === 'featured' ? 'Những sản phẩm được chọn lọc kỹ lưỡng' :
               activeFilter === 'hot' ? 'Những sản phẩm được khách hàng yêu thích' :
               'Khám phá toàn bộ bộ sưu tập bánh ngọt của chúng tôi'}
            </p>
          </motion.div>

          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Icons.Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 mb-6">Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác</p>
              <button
                onClick={clearFilters}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product, idx: number) => renderProductCard(product, idx))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 