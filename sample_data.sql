-- Dữ liệu mẫu cho thống kê
-- Chạy file này sau khi đã tạo database và bảng

-- Thêm đơn hàng mẫu với status đúng
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, created_at) VALUES
(1, 150000, 'completed', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 200000, 'delivered', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(2, 180000, 'completed', '456 Đường XYZ, Quận 2, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 120000, 'pending', '456 Đường XYZ, Quận 2, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 250000, 'delivered', '789 Đường DEF, Quận 3, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 300000, 'cancelled', '789 Đường DEF, Quận 3, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 175000, 'completed', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 220000, 'delivered', '456 Đường XYZ, Quận 2, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(3, 195000, 'completed', '789 Đường DEF, Quận 3, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(1, 280000, 'pending', '123 Đường ABC, Quận 1, TP.HCM', 'vnpay', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Thêm chi tiết đơn hàng
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
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
(6, 5, 1, 120000),
(7, 1, 2, 75000),
(7, 3, 1, 200000),
(8, 2, 3, 50000),
(8, 4, 1, 150000),
(9, 1, 1, 75000),
(9, 5, 1, 120000),
(10, 3, 2, 200000),
(10, 4, 1, 150000);

-- Thêm người dùng mẫu
INSERT INTO users (username, email, password, role, created_at) VALUES
('user1', 'user1@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('user2', 'user2@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('user3', 'user3@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('user4', 'user4@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('user5', 'user5@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 25 DAY)),
('user6', 'user6@example.com', '$2b$10$example_hash', 'user', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Thêm đánh giá mẫu
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Bánh rất ngon!', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 2, 4, 'Hương vị tốt', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 3, 5, 'Chất lượng tuyệt vời', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 4, 4, 'Đáng mua', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 5, 3, 'Tạm được', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 1, 5, 'Rất hài lòng', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(1, 2, 4, 'Giao hàng nhanh', DATE_SUB(NOW(), INTERVAL 1 DAY)); 