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