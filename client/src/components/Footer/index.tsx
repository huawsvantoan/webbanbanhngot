import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Logo and Description */}
        <div>
          <Link to="/" className="flex items-center mb-4">
            <img src="/images/logo.png" alt="Cake Shop Logo" className="h-10 mr-2" />
            <span className="text-xl font-extrabold text-white">Cake Shop</span>
          </Link>
          <p className="text-sm mb-4">
            Cửa hàng bánh ngọt lớn nhất, cung cấp những chiếc bánh ngon và chất lượng nhất.
          </p>
          <div className="flex space-x-4 mb-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <img src="/images/google-play.png" alt="Google Play" className="h-10" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <img src="/images/app-store.png" alt="App Store" className="h-10" />
            </a>
          </div>
        </div>

        {/* Column 2: Category */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Danh Mục</h3>
          <ul className="space-y-2">
            <li><Link to="/category/dried-fruit" className="hover:text-white transition-colors text-sm">Bánh mì</Link></li>
            <li><Link to="/category/cookies" className="hover:text-white transition-colors text-sm">Bánh Ngọt</Link></li>
            <li><Link to="/category/fresh-fruit" className="hover:text-white transition-colors text-sm">Bánh Quy</Link></li>
            <li><Link to="/category/tuber-root" className="hover:text-white transition-colors text-sm">Socola</Link></li>
            <li><Link to="/category/vegetables" className="hover:text-white transition-colors text-sm">Bánh Tổng Hợp</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Công Ty</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-white transition-colors text-sm">Về Chúng Tôi</Link></li>
            <li><Link to="/delivery" className="hover:text-white transition-colors text-sm">Giao Hàng</Link></li>
            <li><Link to="/legal-notice" className="hover:text-white transition-colors text-sm">Thông Báo Pháp Lý</Link></li>
            <li><Link to="/terms-conditions" className="hover:text-white transition-colors text-sm">Điều Khoản & Điều Kiện</Link></li>
            <li><Link to="/secure-payment" className="hover:text-white transition-colors text-sm">Thanh Toán An Toàn</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors text-sm">Liên Hệ</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Liên Hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center"><Icons.MapPin className="mr-2" /> 2548 Broaddus Maple Court, Madison, 4793, USA</li>
            <li className="flex items-center"><Icons.Phone className="mr-2" /> +00 9876543210</li>
            <li className="flex items-center"><Icons.Mail className="mr-2" /> example@email.com</li>
          </ul>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Icons.FacebookF size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Icons.Twitter size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Icons.Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Icons.LinkedinIn size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        <p>Copyright © 2023 All rights reserved. Powered by Cake Shop.</p>
        <div className="flex justify-center items-center mt-4 space-x-2">
          {/* Placeholder for payment icons */}
          <img src="/images/payment-methods.png" alt="Payment Methods" className="h-8" />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 