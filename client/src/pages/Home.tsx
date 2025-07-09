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
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
    api.get('/banners')
      .then(res => setBanners(res.data))
      .catch(() => setBanners([]));
  }, [dispatch]);

  const blogPosts = [
    {
      id: 1,
      date: '30 Jun',
      image: '/images/blog-1.jpg',
      title: 'Marketing Guide: 5 Steps to Success to way.',
      link: '#',
    },
    {
      id: 2,
      date: '02 Apr',
      image: '/images/blog-2.jpg',
      title: 'Best way to solve business issue in market.',
      link: '#',
    },
    {
      id: 3,
      date: '09 Mar',
      image: '/images/blog-3.jpg',
      title: '31 grocery customer service stats know in 2018.',
      link: '#',
    },
    {
      id: 4,
      date: '25 Jan',
      image: '/images/blog-4.jpg',
      title: 'Business ideas to grow your business traffic.',
      link: '#',
    },
    {
      id: 5,
      date: '10 Dec',
      image: '/images/blog-5.jpg',
      title: 'Marketing Guide: 5 Steps to Success to way.',
      link: '#',
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Banner/Hero Section */}
      <Banner banners={banners} />

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Danh Mục Sản Phẩm</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Khám phá các loại bánh ngọt thơm ngon của chúng tôi</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {categoriesData.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/products?category=${category.name}`}
                  className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative border border-gray-100 hover:border-pink-200"
                >
                  <span className={`absolute top-4 right-4 text-sm font-semibold ${category.iconColor} bg-opacity-10 px-3 py-1 rounded-full`}>
                    {category.percent}
                  </span>
                  <div className={`w-20 h-20 rounded-2xl ${category.bgColor} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon size={40} className={`${category.iconColor} transform group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm group-hover:text-gray-700 transition-colors duration-300">
                    {category.items} sản phẩm
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Hot Products */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Sản Phẩm Hot</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Những sản phẩm được yêu thích nhất của chúng tôi</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-pink-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-6 text-xl">Đang tải sản phẩm hot...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products.slice(0, 4).map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
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
                      className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        -10%
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        className="bg-pink-600 text-white rounded-full p-3 hover:bg-pink-700 transition-colors transform hover:scale-110"
                        onClick={() => handleAddToCart(product.id, imgRefs.current[index])}
                      >
                        <Icons.ShoppingCart size={20} />
                      </button>
                      <Link to={`/products/${product.id}`} className="bg-white text-gray-800 rounded-full p-3 hover:bg-gray-200 transition-colors transform hover:scale-110">
                        <Icons.ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">Category: {product.category_name}</p>
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-lg font-bold text-pink-600">{product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                      {/* <span className="text-sm text-gray-500 line-through">$25.00</span> */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section 2 */}
      <section className="relative bg-cover bg-center py-20 lg:py-32" style={{ backgroundImage: 'url(/images/section-banner-1.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold mb-4"
          >
            Bánh Mới Nhất Trong Tuần
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto"
          >
            Khám phá những chiếc bánh ngọt mới nhất được làm thủ công, hoàn hảo cho mọi dịp.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors shadow-lg">
              Khám Phá Ngay
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Khách Hàng Nói Gì</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Lời nhận xét từ những khách hàng yêu quý của chúng tôi</p>
          </motion.div>
          <div className="relative">
            {/* Testimonial cards - simplified for now */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-pink-50 p-8 rounded-2xl shadow-lg border border-pink-100 text-center"
              >
                <img src="/images/person-1.jpg" alt="Client" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-md" />
                <p className="text-gray-700 text-lg italic mb-4">"Bánh ở đây thực sự tuyệt vời! Mỗi miếng cắn đều là một trải nghiệm."</p>
                <h3 className="font-bold text-gray-800 text-xl">Nguyễn Văn A</h3>
                <p className="text-gray-500 text-sm">Khách hàng thân thiết</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100 text-center"
              >
                <img src="/images/person-2.jpg" alt="Client" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-md" />
                <p className="text-gray-700 text-lg italic mb-4">"Dịch vụ khách hàng tuyệt vời và bánh thì luôn tươi ngon."</p>
                <h3 className="font-bold text-gray-800 text-xl">Trần Thị B</h3>
                <p className="text-gray-500 text-sm">Khách hàng mới</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-yellow-50 p-8 rounded-2xl shadow-lg border border-yellow-100 text-center"
              >
                <img src="/images/person-3.jpg" alt="Client" className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-md" />
                <p className="text-gray-700 text-lg italic mb-4">"Tôi rất ấn tượng với sự đa dạng của các loại bánh. Luôn có điều gì đó mới mẻ để thử."</p>
                <h3 className="font-bold text-gray-800 text-xl">Lê Văn C</h3>
                <p className="text-gray-500 text-sm">Khách hàng trung thành</p>
              </motion.div>
            </div>

            {/* Navigation Arrows for Testimonials */}
            <button className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500">
              <Icons.ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500">
              <Icons.ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Những Con Số Ấn Tượng</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Chúng tôi tự hào về những thành tựu của mình</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="text-pink-600 mb-4">
                <Icons.ShoppingBag size={48} className="mx-auto" />
              </div>
              <h3 className="text-5xl font-extrabold text-gray-800 mb-2">10,000+</h3>
              <p className="text-gray-600 text-lg font-medium">Sản Phẩm Đã Bán</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="text-green-600 mb-4">
                <Icons.Heart size={48} className="mx-auto" />
              </div>
              <h3 className="text-5xl font-extrabold text-gray-800 mb-2">5,000+</h3>
              <p className="text-gray-600 text-lg font-medium">Khách Hàng Hài Lòng</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="text-blue-600 mb-4">
                <Icons.Gift size={48} className="mx-auto" />
              </div>
              <h3 className="text-5xl font-extrabold text-gray-800 mb-2">1,200+</h3>
              <p className="text-gray-600 text-lg font-medium">Giải Thưởng Đạt Được</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="text-purple-600 mb-4">
                <Icons.Package size={48} className="mx-auto" />
              </div>
              <h3 className="text-5xl font-extrabold text-gray-800 mb-2">250+</h3>
              <p className="text-gray-600 text-lg font-medium">Loại Bánh Độc Đáo</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-extrabold mb-4"
          >
            Đặt Hàng Ngay Để Nhận Ưu Đãi Đặc Biệt!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg lg:text-xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Đừng bỏ lỡ cơ hội thưởng thức những chiếc bánh tuyệt vời với giá ưu đãi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="inline-block bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
              Đến Cửa Hàng
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Section (Dummy Data) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Bài Viết Mới Nhất</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Cập nhật những công thức và xu hướng mới nhất</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      {post.date}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <Link
                    to={post.link}
                    className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700 transition-colors duration-200"
                  >
                    Đọc Thêm
                    <Icons.ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/blog" className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors shadow-md">
              Xem Tất Cả Bài Viết
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 