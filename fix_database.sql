-- Script cập nhật database để thêm các trường mới cho sản phẩm
USE webbanhngot;

-- Kiểm tra xem các cột đã tồn tại chưa
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME IN ('is_featured', 'is_hot', 'discount_percent', 'original_price', 'view_count', 'rating_avg', 'rating_count');

-- Thêm các cột mới nếu chưa tồn tại
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm nổi bật',
ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm hot/bán chạy',
ADD COLUMN IF NOT EXISTS discount_percent INT DEFAULT 0 COMMENT 'Phần trăm giảm giá (0-100)',
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2) DEFAULT NULL COMMENT 'Giá gốc trước khi giảm giá',
ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0 COMMENT 'Số lượt xem sản phẩm',
ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(3, 2) DEFAULT 0.00 COMMENT 'Điểm đánh giá trung bình',
ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0 COMMENT 'Số lượng đánh giá';

-- Cập nhật dữ liệu mẫu cho các sản phẩm hiện có
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

-- Hiển thị kết quả để kiểm tra
SELECT id, name, is_featured, is_hot, discount_percent, original_price, view_count, rating_avg, rating_count 
FROM products 
ORDER BY id; 