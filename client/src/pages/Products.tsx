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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const isFirstLoad = useRef(true);
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

    fetchCategories();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
    setSearchQuery(urlSearch);
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [searchParams.get('search')]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(searchQuery && { search: searchQuery }),
          ...(selectedCategory && { category: selectedCategory.toString() })
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
  }, [currentPage, searchQuery, selectedCategory]);

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
        // Tính tâm icon giỏ hàng
        const cartCenterX = cartRect.left + cartRect.width / 2;
        const cartCenterY = cartRect.top + cartRect.height / 2;
        // Tính tâm ảnh sản phẩm
        const imgCenterX = imgRect.left + imgRect.width / 2;
        const imgCenterY = imgRect.top + imgRect.height / 2;
        // Đích đến là tâm icon, ảnh sẽ thu nhỏ còn 1/4 kích thước ban đầu
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
      // Có thể thêm toast ở đây nếu muốn
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error message
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </form>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product, idx: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square">
                  <img
                    ref={el => imgRefs.current[idx] = el}
                    src={
                      product.image_url
                        ? product.image_url.startsWith('http')
                          ? product.image_url
                          : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${product.image_url.startsWith('/') ? '' : '/uploads/'}${product.image_url}`
                        : '/images/default-cake.jpg'
                    }
                    alt={product.name || ''}
                    className="w-full h-full object-cover"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                </div>
              </Link>
              <div className="px-4 pb-4 flex items-center justify-between">
                <span className="text-xl font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={e => handleAddToCart(product.id, e, imgRefs.current[idx])}
                  disabled={product.stock === 0}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === page
                      ? 'bg-pink-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 