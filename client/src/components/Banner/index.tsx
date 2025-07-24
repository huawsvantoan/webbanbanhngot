import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../icons';
import { Link } from 'react-router-dom';

interface Banner {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
}

interface BannerProps {
  banners?: Banner[];
}

const Banner: React.FC<BannerProps> = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock banners if none provided
  const defaultBanners: Banner[] = [
    {
      id: 1,
      title: 'Bánh Mì Tươi Mỗi Ngày',
      description: 'Thơm ngon, giòn rụm, giao tận nơi trong 30 phút',
      image_url: '/images/banner1.avif',
      link_url: '/products',
      is_active: true,
      sort_order: 1
    },
    {
      id: 2,
      title: 'Bánh Kem Nghệ Thuật',
      description: 'Đặt bánh sinh nhật, cưới hỏi, sự kiện theo yêu cầu',
      image_url: '/images/banner2.avif',
      link_url: '/products?category=banh-kem',
      is_active: true,
      sort_order: 2
    },
    {
      id: 3,
      title: 'Combo Ngọt Ngào',
      description: 'Ưu đãi 20% cho combo bánh ngọt và trà sữa',
      image_url: '/images/banner3.avif',
      link_url: '/products?category=combo',
      is_active: true,
      sort_order: 3
    },
    {
      id: 4,
      title: 'Bánh Mousse Mát Lạnh',
      description: 'Thưởng thức mousse trái cây tươi mát, mềm mịn',
      image_url: '/images/banner4.avif',
      link_url: '/products?category=mousse',
      is_active: true,
      sort_order: 4
    },
    {
      id: 5,
      title: 'Bánh Ngọt Đặc Sắc',
      description: 'Khám phá các loại bánh ngọt Pháp, Ý, Nhật...',
      image_url: '/images/banner5.avif',
      link_url: '/products?category=banh-ngot',
      is_active: true,
      sort_order: 5
    },
  ];

  const activeBanners = banners.length > 0 ? banners.filter(b => b.is_active) : defaultBanners;

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-gray-100 rounded-2xl shadow-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className="relative h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
            style={{
              backgroundImage: `url(${activeBanners[currentSlide].image_url})`,
            }}
          >
            {/* Overlay gradient mạnh hơn cho chữ nổi bật trên ảnh thật */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent rounded-2xl"></div>
          </div>

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-white drop-shadow-xl">
                {/* Badge vị trí */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-block bg-pink-500/80 text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                    {`Vị trí ${activeBanners[currentSlide].sort_order || currentSlide + 1}`}
                  </span>
                  {activeBanners[currentSlide].is_active ? (
                    <span className="inline-block bg-green-500/80 text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">Đang hiển thị</span>
                  ) : (
                    <span className="inline-block bg-gray-400/80 text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-sm">Đã ẩn</span>
                  )}
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-2xl"
                  style={{ textShadow: '0 6px 32px rgba(0,0,0,0.7)' }}
                >
                  {activeBanners[currentSlide].title}
                </motion.h1>
                {activeBanners[currentSlide].description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-2xl mb-8 text-gray-100 drop-shadow-xl"
                  >
                    {activeBanners[currentSlide].description}
                  </motion.p>
                )}
                {activeBanners[currentSlide].link_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to={activeBanners[currentSlide].link_url!}
                      className="inline-block bg-gradient-to-r from-pink-600 to-pink-400 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 hover:from-pink-700 hover:to-pink-500 transition-all duration-200 border-2 border-white/30"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-pink-600 p-2 rounded-full transition-colors duration-200 shadow-lg backdrop-blur-sm border border-white/40"
          >
            <Icons.ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-pink-600 p-2 rounded-full transition-colors duration-200 shadow-lg backdrop-blur-sm border border-white/40"
          >
            <Icons.ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}
      {/* Dots Indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-200 ${
                index === currentSlide ? 'bg-pink-500 scale-110 shadow-lg' : 'bg-white/60 hover:bg-pink-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner; 