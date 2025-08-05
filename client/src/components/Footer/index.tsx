import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icons } from '../icons';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl animate-ping"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Main Footer Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Brand & Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Icons.Gift className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Cake Shop
                  </h3>
                  <p className="text-blue-300 text-sm font-medium">Bánh ngọt chất lượng cao</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed">
                Chuyên cung cấp những chiếc bánh ngọt thơm ngon, được làm thủ công với tình yêu và sự tỉ mỉ.
              </p>

              {/* Business Info */}
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20"
                >
                  <Icons.Clock className="text-blue-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Giờ làm việc</p>
                    <p className="text-sm font-semibold text-white">7:00 - 22:00</p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20"
                >
                  <Icons.Star className="text-blue-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Chứng nhận</p>
                    <p className="text-sm font-semibold text-white">ISO 22000</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Column 2: Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Icons.FolderOpen className="mr-3 text-blue-400" size={20} />
                Danh Mục Sản Phẩm
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Bánh Mì Tươi', icon: Icons.ShoppingBag, color: 'text-emerald-400' },
                  { name: 'Bánh Ngọt', icon: Icons.Gift, color: 'text-pink-400' },
                  { name: 'Bánh Quy', icon: Icons.Star, color: 'text-amber-400' },
                  { name: 'Socola', icon: Icons.Heart, color: 'text-rose-400' },
                  { name: 'Bánh Tổng Hợp', icon: Icons.Package, color: 'text-violet-400' }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className={`${item.color} group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon size={16} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Column 3: Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Icons.Users className="mr-3 text-blue-400" size={20} />
                Về Công Ty
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Về Chúng Tôi', icon: Icons.Info },
                  { name: 'Giao Hàng', icon: Icons.Truck },
                  { name: 'Thông Báo Pháp Lý', icon: Icons.Lock },
                  { name: 'Điều Khoản & Điều Kiện', icon: Icons.Info },
                  { name: 'Thanh Toán An Toàn', icon: Icons.CreditCard },
                  { name: 'Liên Hệ', icon: Icons.Phone }
                ].map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                      <item.icon size={16} />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                      {item.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Column 4: Contact & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Icons.Phone className="mr-3 text-blue-400" size={20} />
                Liên Hệ
              </h3>
              
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10"
                >
                  <Icons.MapPin className="text-blue-400 mt-1" size={16} />
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      2548 Broaddus Maple Court, Madison, 4793, USA
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10"
                >
                  <Icons.Phone className="text-blue-400" size={16} />
                  <span className="text-gray-300">+00 9876543210</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10"
                >
                  <Icons.Mail className="text-blue-400" size={16} />
                  <span className="text-gray-300">example@email.com</span>
                </motion.div>
              </div>

              {/* Social Media */}
              <div className="pt-4">
                <h4 className="text-white font-semibold mb-4">Theo Dõi Chúng Tôi</h4>
                <div className="flex space-x-4">
                  {[
                    { icon: Icons.FacebookF, color: 'hover:text-blue-400' },
                    { icon: Icons.Twitter, color: 'hover:text-sky-400' },
                    { icon: Icons.Instagram, color: 'hover:text-pink-400' },
                    { icon: Icons.LinkedinIn, color: 'hover:text-blue-500' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:bg-white/20 border border-white/20`}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-gray-400 text-sm"
              >
                Copyright © 2024 All rights reserved. Powered by Cake Shop.
              </motion.p>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center space-x-4"
              >
                <span className="text-gray-400 text-sm">Thanh toán:</span>
                <div className="flex space-x-2">
                  {['VISA', 'MC', 'ZALOPAY'].map((method, index) => (
                    <motion.div
                      key={method}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-white/20 transition-all duration-300 border border-white/20"
                    >
                      {method}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 