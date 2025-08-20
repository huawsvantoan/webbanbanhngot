import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-green-300 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icons.Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Cake Shop
                </h3>
                <p className="text-xs text-gray-300">Premium Bakery</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Cửa hàng bánh ngọt hàng đầu, mang đến những chiếc bánh thơm ngon và chất lượng cao nhất cho mọi dịp đặc biệt.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <Icons.FacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <Icons.Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <Icons.Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Thông Tin Doanh Nghiệp</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Giờ Làm Việc</h4>
                  <p className="text-sm text-gray-300">Thứ 2 - Chủ Nhật: 7:00 - 22:00</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Chứng Nhận ISO</h4>
                  <p className="text-sm text-gray-300">ISO 22000:2018 - An toàn thực phẩm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Danh Mục Sản Phẩm</h3>
            <div className="space-y-3">
              {[
                { name: 'Bánh Mì', icon: Icons.ShoppingBag, color: 'from-green-500 to-emerald-500' },
                { name: 'Bánh Ngọt', icon: Icons.Star, color: 'from-pink-500 to-rose-500' },
                { name: 'Bánh Quy', icon: Icons.Package, color: 'from-blue-500 to-cyan-500' },
                { name: 'Socola', icon: Icons.Heart, color: 'from-purple-500 to-violet-500' },
                { name: 'Bánh Tổng Hợp', icon: Icons.Star, color: 'from-yellow-500 to-orange-500' }
              ].map((category, index) => (
                <Link
                  key={index}
                  to={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center space-x-3 group hover:bg-white/5 rounded-lg p-2 transition-all duration-300"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Liên Hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Địa Chỉ</h4>
                  <p className="text-sm text-gray-300">2548 Broaddus Maple Court, Madison, 4793, USA</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Điện Thoại</h4>
                  <p className="text-sm text-gray-300">+84 395 107 987</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Icons.Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Email</h4>
                  <p className="text-sm text-gray-300">info@cakeshop.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                © 2024 Cake Shop. Tất cả quyền được bảo lưu.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icons.CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Thanh Toán An Toàn</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icons.Truck className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Giao Hàng Toàn Quốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
