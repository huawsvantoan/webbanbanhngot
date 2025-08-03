-- Script cập nhật an toàn database webbanhngot
USE webbanhngot;

-- Kiểm tra và thêm các cột mới (chỉ thêm nếu chưa có)
SET @sql = '';

-- Kiểm tra cột is_featured
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'is_featured';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN is_featured BOOLEAN DEFAULT FALSE,');
END IF;

-- Kiểm tra cột is_hot
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'is_hot';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN is_hot BOOLEAN DEFAULT FALSE,');
END IF;

-- Kiểm tra cột discount_percent
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'discount_percent';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN discount_percent INT DEFAULT 0,');
END IF;

-- Kiểm tra cột original_price
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'original_price';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN original_price DECIMAL(10, 2) DEFAULT NULL,');
END IF;

-- Kiểm tra cột view_count
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'view_count';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN view_count INT DEFAULT 0,');
END IF;

-- Kiểm tra cột rating_avg
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'rating_avg';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN rating_avg DECIMAL(3, 2) DEFAULT 0.00,');
END IF;

-- Kiểm tra cột rating_count
SELECT COUNT(*) INTO @exists FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'webbanhngot' AND TABLE_NAME = 'products' AND COLUMN_NAME = 'rating_count';
IF @exists = 0 THEN
    SET @sql = CONCAT(@sql, 'ADD COLUMN rating_count INT DEFAULT 0,');
END IF;

-- Thực hiện ALTER TABLE nếu có cột cần thêm
IF LENGTH(@sql) > 0 THEN
    SET @sql = CONCAT('ALTER TABLE products ', TRIM(TRAILING ',' FROM @sql));
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    SELECT 'Da them cac cot moi' AS Result;
ELSE
    SELECT 'Tat ca cac cot da ton tai' AS Result;
END IF;

-- Cập nhật dữ liệu mẫu cho các sản phẩm (chỉ cập nhật nếu chưa có dữ liệu)
UPDATE products SET 
  is_featured = TRUE,
  is_hot = TRUE,
  discount_percent = 15,
  original_price = 85000,
  view_count = 150,
  rating_avg = 4.5,
  rating_count = 12
WHERE id = 1 AND (is_featured IS NULL OR is_hot IS NULL);

UPDATE products SET 
  is_featured = TRUE,
  is_hot = FALSE,
  discount_percent = 10,
  original_price = 60000,
  view_count = 89,
  rating_avg = 4.2,
  rating_count = 8
WHERE id = 2 AND (is_featured IS NULL OR is_hot IS NULL);

UPDATE products SET 
  is_featured = FALSE,
  is_hot = TRUE,
  discount_percent = 20,
  original_price = 120000,
  view_count = 234,
  rating_avg = 4.8,
  rating_count = 18
WHERE id = 3 AND (is_featured IS NULL OR is_hot IS NULL);

UPDATE products SET 
  is_featured = TRUE,
  is_hot = TRUE,
  discount_percent = 0,
  original_price = NULL,
  view_count = 67,
  rating_avg = 4.0,
  rating_count = 5
WHERE id = 4 AND (is_featured IS NULL OR is_hot IS NULL);

UPDATE products SET 
  is_featured = FALSE,
  is_hot = FALSE,
  discount_percent = 5,
  original_price = 95000,
  view_count = 45,
  rating_avg = 4.3,
  rating_count = 7
WHERE id = 5 AND (is_featured IS NULL OR is_hot IS NULL);

UPDATE products SET 
  is_featured = TRUE,
  is_hot = FALSE,
  discount_percent = 0,
  original_price = NULL,
  view_count = 123,
  rating_avg = 4.6,
  rating_count = 15
WHERE id = 6 AND (is_featured IS NULL OR is_hot IS NULL);

-- Hiển thị kết quả
SELECT id, name, is_featured, is_hot, discount_percent, original_price, view_count, rating_avg, rating_count 
FROM products 
ORDER BY id; 