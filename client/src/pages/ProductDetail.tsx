import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProductById, clearCurrentProduct } from '../features/products/productSlice';
import { RootState } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/icons';
import { toast } from 'react-hot-toast';
import Reviews from '../components/Reviews';
import { addToCart } from '../features/cart/cartSlice';

const DEFAULT_CAKE_IMAGE = '/images/default-cake.png';

const getImageUrl = (img?: string | null) => {
  if (!img) return DEFAULT_CAKE_IMAGE;
  if (img.startsWith('http')) return img;
  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${img.startsWith('/') ? '' : '/uploads/'}${img}`;
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state: RootState) => state.products.currentProduct);
  const productStatus = useAppSelector((state: RootState) => state.products.loading ? 'loading' : state.products.error ? 'failed' : 'idle');
  const error = useAppSelector((state: RootState) => state.products.error);
  const user = useAppSelector((state: RootState) => state.auth.user);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mock images for gallery (replace with actual product images)
  const productImages = [
    getImageUrl(product?.image_url),
    '/images/product-detail-1.jpg',
    '/images/product-detail-2.jpg',
    '/images/product-detail-3.jpg',
  ];

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [id, dispatch]);

  const handleQuantityChange = (value: number) => {
    if (product && value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      toast.error('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error: any) {
      toast.error(error || 'Thêm vào giỏ hàng thất bại!');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description || '',
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (productStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            <Icons.ChevronLeft />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-8">
        <button
          onClick={() => navigate('/products')}
          className="hover:text-pink-600 transition-colors"
        >
          Products
        </button>
        <Icons.ChevronRight className="mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Gallery */}
          <div className="md:w-1/2 p-6">
            <div className="relative aspect-square mb-4">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <Icons.ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <Icons.ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-pink-600' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-pink-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-lg mb-6">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icons.Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} items available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md text-white font-semibold transition-colors ${
                  product.stock === 0 || isAddingToCart
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700'
                }`}
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <Icons.ShoppingCart className="w-5 h-5" />
                )}
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md font-semibold transition-colors border ${
                  isWishlist
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icons.Heart className="w-5 h-5" fill={isWishlist ? 'currentColor' : 'none'} />
                {isWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
              <button
                onClick={handleShare}
                className="flex-shrink-0 p-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icons.Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Product Meta */}
            <div className="border-t border-gray-200 pt-6 mt-6 text-sm text-gray-600 space-y-2">
              <p>SKU: CAKE-12345</p>
              <p>Category: <Link to={`/products?category=${product.category_name}`} className="text-pink-600 hover:underline">{product.category_name || 'N/A'}</Link></p>
              <p>Tags: Cake, Sweet, Dessert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Reviews 
          productId={product.id} 
          currentUserId={user?.id}
          isAdmin={user?.role === 'admin'}
        />
      </div>
    </div>
  );
};

export default ProductDetail; 