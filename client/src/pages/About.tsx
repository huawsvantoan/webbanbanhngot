import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Về Chúng Tôi - Cake Shop</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Nơi hương vị truyền cảm hứng, và mỗi chiếc bánh là một tác phẩm nghệ thuật.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <img 
              src="/images/about-us.jpg" 
              alt="About Cake Shop" 
              className="rounded-2xl shadow-xl w-full h-auto max-h-[500px] object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hành Trình Ngọt Ngào Của Chúng Tôi</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Cake Shop được thành lập với niềm đam mê mang đến những chiếc bánh không chỉ ngon miệng mà còn là những tác phẩm nghệ thuật.
              Từ những ngày đầu tiên, chúng tôi đã không ngừng sáng tạo, kết hợp công thức truyền thống với những hương vị hiện đại để tạo ra những sản phẩm độc đáo, chinh phục mọi giác quan.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Mỗi chiếc bánh tại Cake Shop đều được làm từ những nguyên liệu tươi ngon nhất, chọn lọc kỹ càng, đảm bảo chất lượng và hương vị hảo hạng.
              Chúng tôi tin rằng, một chiếc bánh ngon không chỉ là sự kết hợp của hương vị mà còn là câu chuyện về sự tận tâm, tỉ mỉ và tình yêu thương mà chúng tôi gửi gắm vào từng sản phẩm.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Đến với Cake Shop, bạn không chỉ tìm thấy những chiếc bánh tuyệt vời cho những dịp đặc biệt mà còn là nơi để bạn tận hưởng những khoảnh khắc ngọt ngào bên gia đình và bạn bè.
              Chúng tôi tự hào là điểm đến yêu thích của những người yêu bánh, nơi hạnh phúc được tạo nên từ những điều giản dị và ngọt ngào nhất.
            </p>
          </motion.div>
        </div>

        {/* Mission and Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
          >
            <h3 className="text-2xl font-bold text-pink-600 mb-4">Sứ Mệnh Của Chúng Tôi</h3>
            <p className="text-gray-600 leading-relaxed">
              Mang đến những chiếc bánh chất lượng cao nhất, được làm từ nguyên liệu tự nhiên và sự tỉ mỉ trong từng công đoạn, làm hài lòng mọi khách hàng.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
          >
            <h3 className="text-2xl font-bold text-pink-600 mb-4">Tầm Nhìn Của Chúng Tôi</h3>
            <p className="text-gray-600 leading-relaxed">
              Trở thành chuỗi cửa hàng bánh ngọt hàng đầu, không ngừng đổi mới và mở rộng, mang hương vị hạnh phúc đến mọi nhà.
            </p>
          </motion.div>
        </div>

        {/* Team Section (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Đội Ngũ Của Chúng Tôi</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những con người đầy nhiệt huyết và tài năng đằng sau mỗi chiếc bánh ngon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 + 1.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100"
            >
              <img 
                src={`/images/team-${member}.jpg`} // Placeholder images
                alt={`Team Member ${member}`}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-pink-100"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-1">Tên Thành Viên {member}</h3>
              <p className="text-pink-600 font-semibold mb-3">Vị trí</p>
              <p className="text-gray-600 text-sm">"Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 