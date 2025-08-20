import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts, setCurrentPage } from '../features/products/productSlice';
import { RootState } from '../store';
import { Product } from '../services/productService';
import { motion } from 'framer-motion';
import { Icons } from '../components/icons';
import { CartIconRef } from '../components/Header';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types/category';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, totalPages, currentPage, total } = useAppSelector((state: RootState) => state.products);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(() => {
    const categoryParam = searchParams.get('category');
    return categoryParam ? parseInt(categoryParam) : null;
  });
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
    
    // Initial products fetch
    dispatch(fetchProducts({ page: 1, limit: itemsPerPage }));
  }, [dispatch]);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category');
    
    setSearchTerm(urlSearch);
    setSearchQuery(urlSearch);
    
    if (urlCategory) {
      setSelectedCategory(parseInt(urlCategory));
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch products using Redux action
    dispatch(fetchProducts({ 
      page: currentPage, 
      limit: itemsPerPage,
      search: searchQuery,
      category: selectedCategory || undefined
    }));
  }, [dispatch, currentPage, searchQuery, selectedCategory]);

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
    dispatch(setCurrentPage(1));
    
    // Cập nhật URL params
    if (categoryId) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('category', categoryId.toString());
        return newParams;
      });
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('category');
        return newParams;
      });
    }
    
    // Fetch products for the selected category
    dispatch(fetchProducts({ 
      page: 1, 
      limit: itemsPerPage,
      category: categoryId || undefined
    }));
  };

  const handleFilterChange = (filter: 'all' | 'featured' | 'hot') => {
    setActiveFilter(filter);
    dispatch(setCurrentPage(1));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('search', searchTerm.trim());
        return newParams;
      });
      
      // Fetch products for the search term
      dispatch(fetchProducts({ 
        page: 1, 
        limit: itemsPerPage,
        search: searchTerm.trim()
      }));
    } else {
      setSearchQuery('');
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('search');
        return newParams;
      });
      
      // Fetch all products when clearing search
      dispatch(fetchProducts({ 
        page: 1, 
        limit: itemsPerPage
      }));
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setActiveFilter('all');
    setSearchTerm('');
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
    dispatch(setCurrentPage(1));
    
    // Reload products after clearing filters
    dispatch(fetchProducts({ page: 1, limit: itemsPerPage }));
  };

  const renderProductCard = (product: Product, index: number, isSpecial: boolean = false) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-pink-200 relative flex flex-col h-full ${
        isSpecial ? 'ring-2 ring-pink-200 shadow-pink-100' : ''
      }`}
    >
      {/* Special Badge for Featured/Hot */}
      {isSpecial && (
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[60px] border-l-pink-500 border-t-[60px] border-t-transparent z-10">
          <div className="absolute top-[-50px] left-[-50px] text-white text-xs font-bold transform -rotate-45">
            {product.is_featured ? 'NỔI BẬT' : 'HOT'}
          </div>
        </div>
      )}

      <Link to={`/products/${product.id}`} className="block flex-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
          
          {/* Discount Badge - Only show if there's real discount */}
          {product.discount_percent && product.discount_percent > 0 && product.original_price && product.original_price > product.price && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
              -{product.discount_percent}%
            </div>
          )}

          {/* Rating Badge */}
          {product.rating_avg && typeof product.rating_avg === 'number' && product.rating_avg > 0 && (
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
              <Icons.Star className="text-yellow-500 fill-current" size={14} />
              <span className="text-sm font-bold text-gray-800">
                {product.rating_avg.toFixed(1)}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
            <div className="bg-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Icons.Eye className="text-gray-700" size={20} />
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Icons.XCircle className="text-white mx-auto mb-2" size={32} />
                <span className="text-white font-bold text-lg">Hết Hàng</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Description */}
          {product.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
              {product.description}
            </p>
          )}
          
          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-pink-600">
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.original_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                )}
              </div>
              {product.stock <= 10 && product.stock > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                  Chỉ còn {product.stock}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-5 pb-5 mt-auto">
        <button
          onClick={e => handleAddToCart(product.id, e, imgRefs.current[index])}
          disabled={product.stock === 0}
          className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group flex items-center justify-center text-base leading-none min-h-[48px] max-h-[48px] ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
          style={{ height: '48px' }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {product.stock === 0 ? (
              <>
                <Icons.XCircle size={16} />
                Hết Hàng
              </>
            ) : (
              <>
                <Icons.ShoppingCart size={16} />
                Thêm Vào Giỏ
              </>
            )}
          </span>
          
          {/* Button Hover Effect */}
          {product.stock > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
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

        {/* Enhanced Categories Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
           
          </motion.div>

          {/* Navigation Buttons */}
          {categories.length > 5 && (
            <div className="flex justify-between items-center mb-6">
              <motion.button
                onClick={() => {
                  const container = document.getElementById('categories-container');
                  if (container) {
                    container.scrollLeft -= 300;
                  }
                }}
                className="flex items-center px-4 py-2 bg-white text-pink-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-pink-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.ChevronLeft size={20} className="mr-2" />
                Trước
              </motion.button>
              
              <div className="text-center">
                <span className="text-gray-600 font-medium">
                  Danh mục sản phẩm
                </span>
              </div>
              
              <motion.button
                onClick={() => {
                  const container = document.getElementById('categories-container');
                  if (container) {
                    container.scrollLeft += 300;
                  }
                }}
                className="flex items-center px-4 py-2 bg-white text-pink-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-pink-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sau
                <Icons.ChevronRight size={20} className="ml-2" />
              </motion.button>
            </div>
          )}

          {/* Categories Grid with Images */}
          <div 
            id="categories-container"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {categories.map((category, index) => {
              // Define colors and icons for each category
              const getCategoryStyle = (categoryName: string) => {
                const name = categoryName.toLowerCase();
                if (name.includes('bông lan') || name.includes('bánh bông lan')) {
                  return {
                    bgGradient: 'from-orange-100 to-yellow-100',
                    iconBg: 'bg-orange-500',
                    icon: Icons.Package,
                    imageUrl: '/images/banner1.avif'
                  };
                } else if (name.includes('kem') || name.includes('bánh kem')) {
                  return {
                    bgGradient: 'from-pink-100 to-purple-100',
                    iconBg: 'bg-pink-500',
                    icon: Icons.Gift,
                    imageUrl: '/images/banner2.avif'
                  };
                } else if (name.includes('mì') || name.includes('bánh mì')) {
                  return {
                    bgGradient: 'from-amber-100 to-orange-100',
                    iconBg: 'bg-amber-500',
                    icon: Icons.Package,
                    imageUrl: '/images/banner3.avif'
                  };
                } else if (name.includes('ngọt') || name.includes('bánh ngọt')) {
                  return {
                    bgGradient: 'from-purple-100 to-pink-100',
                    iconBg: 'bg-purple-500',
                    icon: Icons.Heart,
                    imageUrl: '/images/banner4.avif'
                  };
                } else if (name.includes('sôcla') || name.includes('socola')) {
                  return {
                    bgGradient: 'from-brown-100 to-orange-100',
                    iconBg: 'bg-brown-500',
                    icon: Icons.CheckCircle,
                    imageUrl: '/images/banner5.avif'
                  };
                } else {
                  // Default style
                  return {
                    bgGradient: 'from-gray-100 to-blue-100',
                    iconBg: 'bg-gray-500',
                    icon: Icons.Package,
                    imageUrl: '/images/default-cake.jpg'
                  };
                }
              };

              const style = getCategoryStyle(category.name);
              const IconComponent = style.icon;

              return (
                <motion.div 
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`min-w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                    selectedCategory === category.id ? 'ring-4 ring-pink-300' : ''
                  }`}
                >
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image_url || style.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = style.imageUrl;
                      }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {category.product_count || 0} sản phẩm
                      </span>
                    </div>

                    {/* Icon Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className={`w-10 h-10 ${style.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-pink-600 font-semibold text-sm">
                        Xem sản phẩm
                      </span>
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Icons.ArrowRight className="text-white" size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>



        {/* Featured Products Section */}
        {activeFilter === 'all' && !selectedCategory && !searchQuery && featuredProducts.length > 0 && (
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
        {activeFilter === 'all' && !selectedCategory && !searchQuery && hotProducts.length > 0 && (
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
              {searchQuery ? 
                `Kết quả tìm kiếm cho "${searchQuery}"` :
                selectedCategory ? 
                `${categories.find(cat => cat.id === selectedCategory)?.name || 'Sản Phẩm'}` :
                activeFilter === 'featured' ? 'Sản Phẩm Nổi Bật' : 
                activeFilter === 'hot' ? 'Sản Phẩm Bán Chạy' : 'Tất Cả Sản Phẩm'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {searchQuery ? 
                `Tìm thấy ${products.length} sản phẩm phù hợp với từ khóa "${searchQuery}"` :
                selectedCategory ? 
                `Khám phá các sản phẩm ${categories.find(cat => cat.id === selectedCategory)?.name?.toLowerCase() || ''} thơm ngon` :
                activeFilter === 'featured' ? 'Những sản phẩm được chọn lọc kỹ lưỡng' :
                activeFilter === 'hot' ? 'Những sản phẩm được khách hàng yêu thích' :
                'Khám phá toàn bộ bộ sưu tập bánh ngọt của chúng tôi'}
            </p>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-600 border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Đang tải sản phẩm...</h3>
              <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
            </motion.div>
          ) : !products || products.length === 0 ? (
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
              {products.map((product: Product, idx: number) => (
                <div key={product.id} className="flex flex-col h-full">
                  {renderProductCard(product, idx)}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            {/* Pagination Info */}
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} trong tổng số {total} sản phẩm
              </p>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-center">
              <nav className="flex items-center gap-2 bg-white rounded-2xl shadow-lg p-2">
                {/* Previous Button */}
                <button
                  onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
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
                  const maxVisiblePages = 7;
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
                        onClick={() => dispatch(setCurrentPage(1))}
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
                        onClick={() => dispatch(setCurrentPage(i))}
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
                        onClick={() => dispatch(setCurrentPage(totalPages))}
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
                  onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))}
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
        )}
      </div>
    </div>
  );
};

export default Products; 