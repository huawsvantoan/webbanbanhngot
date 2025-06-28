import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Icons } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types/product';
import { Category } from '../types/category';
import api from '../services/api';

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
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const isFirstLoad = useRef(true);

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
          sort: sortBy,
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
  }, [currentPage, sortBy, searchQuery, selectedCategory]);

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      // Show success message or update cart count
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Show error message
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as typeof sortBy);
    setCurrentPage(1);
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
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
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
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${product.image_url}`}
                    alt={product.name}
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
                  onClick={() => handleAddToCart(product.id)}
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