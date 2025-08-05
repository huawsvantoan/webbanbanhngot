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

const DEFAULT_CAKE_IMAGE = '/images/default-cake.jpg';

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Product images - chỉ hiển thị ảnh chính nếu không có ảnh phụ
  const productImages = [
    getImageUrl(product?.image_url),
  ];
  
  // Chỉ hiển thị gallery nếu có nhiều hơn 1 ảnh
  const hasMultipleImages = productImages.length > 1;

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

  // Removed wishlist functionality as it's not needed

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
      toast.success('Đã sao chép link vào clipboard!');
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
          <strong className="font-bold">Lỗi: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            <Icons.ChevronLeft />
            Quay lại Sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="hover:text-pink-600 transition-colors flex items-center gap-1"
          >
            <Icons.ChevronLeft className="w-4 h-4" />
            Sản phẩm
          </button>
          <Icons.ChevronRight className="mx-2" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:flex">
            {/* Product Gallery */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="relative aspect-square mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                                 {/* Navigation Arrows - chỉ hiện khi có nhiều ảnh */}
                 {hasMultipleImages && (
                   <>
                     <button
                       onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1))}
                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                     >
                       <Icons.ChevronLeft className="w-5 h-5 text-gray-700" />
                     </button>
                     <button
                       onClick={() => setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0))}
                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                     >
                       <Icons.ChevronRight className="w-5 h-5 text-gray-700" />
                     </button>
                   </>
                 )}

                {/* Stock Status Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Icons.XCircle className="text-white mx-auto mb-2" size={48} />
                      <span className="text-white font-bold text-xl">Hết Hàng</span>
                    </div>
                  </div>
                )}
              </div>
              
                             {/* Thumbnail Gallery - chỉ hiện khi có nhiều ảnh */}
               {hasMultipleImages && (
                 <div className="grid grid-cols-4 gap-3">
                   {productImages.map((image, index) => (
                     <button
                       key={index}
                       onClick={() => setSelectedImage(index)}
                       className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                         selectedImage === index 
                           ? 'border-pink-500 shadow-lg' 
                           : 'border-gray-200 hover:border-pink-300'
                       }`}
                     >
                       <img
                         src={image}
                         alt={`${product.name} - Ảnh ${index + 1}`}
                         className="w-full h-full object-cover"
                       />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="mb-8">
                {/* Product Name */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price Section */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-pink-600">
                    {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.original_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Số lượng
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden hover:border-pink-300 transition-colors">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icons.Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      className="w-20 text-center border-x border-gray-200 py-3 focus:outline-none focus:ring-0 text-lg font-semibold"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Icons.Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Còn {product.stock} sản phẩm
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-white font-semibold transition-all duration-300 ${
                    product.stock === 0 || isAddingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Icons.ShoppingCart className="w-5 h-5" />
                  )}
                  {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex-shrink-0 p-4 rounded-xl border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-pink-300 transition-all duration-300"
                  title="Chia sẻ sản phẩm"
                >
                  <Icons.Share2 className="w-5 h-5" />
                </button>
              </div>

                             {/* Product Meta */}
               <div className="border-t border-gray-200 pt-6 mt-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                   <div>
                     <span className="font-semibold text-gray-700">Mã sản phẩm:</span>
                     <p className="mt-1">CAKE-{product.id.toString().padStart(5, '0')}</p>
                   </div>
                   {product.category_name && (
                     <div>
                       <span className="font-semibold text-gray-700">Danh mục:</span>
                       <p className="mt-1">
                         <Link 
                           to={`/products?category=${product.category_name}`} 
                           className="text-pink-600 hover:underline hover:text-pink-700 transition-colors"
                         >
                           {product.category_name}
                         </Link>
                       </p>
                     </div>
                   )}
                 </div>
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
    </div>
  );
};

export default ProductDetail; 