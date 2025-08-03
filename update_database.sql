-- Script cập nhật database cho VNPay
USE webbanhngot;

-- Thêm cột payment_method và payment_proof vào bảng orders nếu chưa có
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'cod',
ADD COLUMN IF NOT EXISTS payment_proof VARCHAR(255) NULL;

-- Cập nhật ENUM status để bao gồm 'completed'
ALTER TABLE orders 
MODIFY COLUMN status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'completed') DEFAULT 'pending';

-- Kiểm tra và hiển thị cấu trúc bảng orders
DESCRIBE orders; 

-- Thêm bảng payments để lưu thông tin thanh toán VNPAY
-- Bảng Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  vnpay_transaction_no VARCHAR(255),
  refund_transaction_no VARCHAR(255),
  refund_amount DECIMAL(10, 2) NULL,
  refund_reason VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Thêm index để tối ưu query
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_vnpay_transaction ON payments(vnpay_transaction_no); 

-- Cập nhật bảng products để thêm các trường mới
USE webbanhngot;

-- Thêm các trường mới vào bảng products
ALTER TABLE products 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm nổi bật',
ADD COLUMN is_hot BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm hot/bán chạy',
ADD COLUMN discount_percent INT DEFAULT 0 COMMENT 'Phần trăm giảm giá (0-100)',
ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL COMMENT 'Giá gốc trước khi giảm giá',
ADD COLUMN view_count INT DEFAULT 0 COMMENT 'Số lượt xem sản phẩm',
ADD COLUMN rating_avg DECIMAL(3, 2) DEFAULT 0.00 COMMENT 'Điểm đánh giá trung bình',
ADD COLUMN rating_count INT DEFAULT 0 COMMENT 'Số lượng đánh giá';

-- Cập nhật một số sản phẩm mẫu để test
UPDATE products SET 
  is_featured = TRUE,
  is_hot = TRUE,
  discount_percent = 15,
  original_price = 85000,
  view_count = 150,
  rating_avg = 4.5,
  rating_count = 12
WHERE id = 1;

UPDATE products SET 
  is_featured = TRUE,
  is_hot = FALSE,
  discount_percent = 10,
  original_price = 60000,
  view_count = 89,
  rating_avg = 4.2,
  rating_count = 8
WHERE id = 2;

UPDATE products SET 
  is_featured = FALSE,
  is_hot = TRUE,
  discount_percent = 20,
  original_price = 120000,
  view_count = 234,
  rating_avg = 4.8,
  rating_count = 18
WHERE id = 3;

UPDATE products SET 
  is_featured = TRUE,
  is_hot = TRUE,
  discount_percent = 0,
  original_price = NULL,
  view_count = 67,
  rating_avg = 4.0,
  rating_count = 5
WHERE id = 4;

UPDATE products SET 
  is_featured = FALSE,
  is_hot = FALSE,
  discount_percent = 5,
  original_price = 95000,
  view_count = 45,
  rating_avg = 4.3,
  rating_count = 7
WHERE id = 5;

UPDATE products SET 
  is_featured = TRUE,
  is_hot = FALSE,
  discount_percent = 0,
  original_price = NULL,
  view_count = 123,
  rating_avg = 4.6,
  rating_count = 15
WHERE id = 6; 