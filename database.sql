-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS webbanhngot;
USE webbanhngot;

-- Bảng Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Categories
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Bảng Orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  note TEXT NULL,
  payment_method VARCHAR(20) DEFAULT 'cod',
  payment_proof VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Order_Items
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng Cart
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Bảng Reviews (Đánh giá và Bình luận sản phẩm)
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  rating INT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  parent_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Bảng Banners (Banner/Slider)
CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm cột category_id vào bảng products nếu chưa có
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Thêm dữ liệu mẫu cho categories
INSERT INTO categories (name, description) VALUES
('Birthday Cakes', 'Beautiful birthday cakes for all ages'),
('Wedding Cakes', 'Elegant wedding cakes for special occasions'),
('Cupcakes', 'Delicious cupcakes in various flavors'),
('Cookies', 'Fresh baked cookies'),
('Bread', 'Fresh bread and pastries');

-- Thêm dữ liệu mẫu cho banners
INSERT INTO banners (title, description, image_url, link_url, sort_order) VALUES
('Welcome to Our Bakery', 'Discover our delicious cakes and pastries', '/images/banner1.jpg', '/products', 1),
('Special Offers', 'Get 20% off on birthday cakes', '/images/banner2.jpg', '/products?category=1', 2),
('Wedding Collection', 'Perfect cakes for your special day', '/images/banner3.jpg', '/products?category=2', 3); 

-- Bảng lưu mã code OTP đặt lại mật khẩu
CREATE TABLE IF NOT EXISTS password_reset_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
); 

-- Thêm dữ liệu mẫu cho thống kê
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, created_at) VALUES
(1, 150000, 'completed', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 200000, 'completed', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 180000, 'completed', '456 Đường XYZ, Quận 2, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 120000, 'pending', '456 Đường XYZ, Quận 2, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 250000, 'completed', '789 Đường DEF, Quận 3, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 300000, 'cancelled', '789 Đường DEF, Quận 3, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Thêm chi tiết đơn hàng
INSERT INTO order_details (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 75000),
(1, 2, 1, 50000),
(2, 3, 1, 200000),
(3, 1, 3, 75000),
(3, 4, 1, 150000),
(4, 2, 2, 50000),
(4, 5, 1, 120000),
(5, 1, 1, 75000),
(5, 3, 1, 200000),
(5, 4, 1, 150000),
(6, 2, 1, 50000),
(6, 5, 1, 120000);

-- Thêm người dùng mẫu
INSERT INTO users (username, email, password, role, created_at) VALUES
('user1', 'user1@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('user2', 'user2@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('user3', 'user3@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('user4', 'user4@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 20 DAY)); 