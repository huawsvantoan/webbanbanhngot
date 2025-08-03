-- Script cập nhật nhanh database webbanhngot
USE webbanhngot;

-- Thêm các cột mới vào bảng products
ALTER TABLE products 
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN is_hot BOOLEAN DEFAULT FALSE,
ADD COLUMN discount_percent INT DEFAULT 0,
ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN view_count INT DEFAULT 0,
ADD COLUMN rating_avg DECIMAL(3, 2) DEFAULT 0.00,
ADD COLUMN rating_count INT DEFAULT 0;

-- Cập nhật dữ liệu mẫu cho các sản phẩm
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

-- Hiển thị kết quả
SELECT id, name, is_featured, is_hot, discount_percent, original_price, view_count, rating_avg, rating_count 
FROM products 
ORDER BY id; 