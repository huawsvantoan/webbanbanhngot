import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../icons';
 
import { getPublicBanners, Banner as BannerType } from '../../services/bannerService';

interface BannerProps {
  banners?: BannerType[];
}

const Banner: React.FC<BannerProps> = ({ banners: propBanners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        console.log('Fetching banners...');
        const data = await getPublicBanners();
        console.log('Banners loaded:', data);
        setBanners(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching banners:', err);
        setError(err.response?.data?.message || 'Không thể tải banners');
        // Fallback to empty array if API fails
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    // If banners are provided as props, use them; otherwise fetch from API
    if (propBanners && propBanners.length > 0) {
      setBanners(propBanners);
      setLoading(false);
    } else {
      fetchBanners();
    }
  }, [propBanners]);

  // Auto-slide effect
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Reset image error when slide changes
  useEffect(() => {
    setImageError(false);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-gray-200 animate-pulse rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    console.log('No banners to display');
    return null;
  }

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-100 rounded-2xl shadow-xl">
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
               backgroundImage: imageError 
                 ? 'url(/images/default-cake.jpg)' 
                 : `url(${banners[currentSlide].image_url})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }}
           >
                         {/* Overlay gradient tăng độ tương phản chữ */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent rounded-2xl"></div>
             
             {/* Hidden image to check for errors */}
             <img
               src={banners[currentSlide].image_url}
               alt=""
               className="hidden"
               onError={() => setImageError(true)}
               onLoad={() => setImageError(false)}
             />
           </div>

          {/* Ẩn tiêu đề và mô tả để chỉ hiển thị slider hình ảnh */}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
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
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
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