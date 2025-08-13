-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th8 08, 2025 lúc 10:41 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `webbanhngot`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `position` int(11) DEFAULT 1,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `title`, `description`, `image_url`, `link_url`, `is_active`, `sort_order`, `created_at`, `updated_at`, `position`, `deleted_at`, `isDeleted`) VALUES
(1, 'Welcome to Our Bakery', 'Discover our delicious cakes and pastries', '/uploads/images/1754371385796-722838274-banner4.avif', '/products', 1, 1, '2025-06-17 04:26:06', '2025-08-05 05:23:07', 5, NULL, 0),
(2, 'Special Offers', 'Get 20% off on birthday cakes', '/uploads/images/1754590811750-231304442-banner1.avif', '/products?category=1', 1, 2, '2025-06-17 04:26:06', '2025-08-07 18:20:12', 1, NULL, 0),
(3, 'Wedding Collection', 'Perfect cakes for your special day', '/uploads/images/1754380881490-499066286-banner2.avif', '/products?category=2', 1, 3, '2025-06-17 04:26:06', '2025-08-06 06:28:48', 3, NULL, 0),
(4, 'banner4', 'banner4', '/uploads/images/1754371365917-182410614-banner3.avif', '/products', 1, 0, '2025-08-04 16:13:08', '2025-08-05 05:22:46', 4, NULL, 0),
(6, 'banner', 'banner', '/uploads/images/1754371393950-399733376-banner5.avif', '', 1, 0, '2025-08-04 16:53:22', '2025-08-05 05:23:14', 6, NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `user_id`, `title`, `slug`, `content`, `image_url`, `status`, `published_at`, `created_at`, `updated_at`, `isDeleted`) VALUES
(13, 7, 'Bánh cupcake', 'kkgytff', '<p>Bánh ngọt handmade ngày càng nổi tiếng và được nhiều bạn trẻ yêu thích bởi hương vị thơm ngon và những giá trị dinh dưỡng mà nó mang lại. Để rõ hơn hãy cùng Hanami tìm hiểu về bánh ngọt handmade là gì và cách làm những loại bánh này ra sao nhé!</p>', '/uploads/images/1754411587827-505302514-bÃ¡nh bao.jpg', 'published', NULL, '2025-06-25 17:37:35', '2025-08-05 16:33:08', 0),
(14, 7, 'bánh ngon mỗi ngàyyyy', 'bánh-ngon-mỗi-ngày', 'bánh ngon quá hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ hẹ', '/uploads/images/1751131556952-416834009-banhmi.webp', 'published', NULL, '2025-06-28 16:28:37', '2025-07-12 15:38:18', 0),
(27, NULL, 'Công thức làm bánh Tiramisu truyền thốngg', 'cong-thuc-lam-banh-tiramisu-truyen-thong', '<h2>Bánh Tiramisu - Món tráng miệng Ý nổi tiếng</h2><p>Tiramisu là một món tráng miệng truyền thống của Ý, được làm từ bánh ladyfinger thấm đẫm cà phê, kem mascarpone mịn màng và bột cacao đắng ngọt.</p><h3>Nguyên liệu cần thiết:</h3><ul><li>6 lòng đỏ trứng gà</li><li>1/2 cup đường</li><li>1 cup mascarpone cheese</li><li>1 cup kem tươi</li><li>24 bánh ladyfinger</li><li>1 cup cà phê đậm đặc</li><li>Bột cacao để rắc</li></ul><h3>Cách làm:</h3><ol><li>Đánh bông lòng đỏ trứng với đường cho đến khi hỗn hợp chuyển sang màu vàng nhạt</li><li>Thêm mascarpone và đánh đều</li><li>Đánh bông kem tươi riêng, sau đó trộn vào hỗn hợp mascarpone</li><li>Nhúng bánh ladyfinger vào cà phê và xếp một lớp dưới đáy khuôn</li><li>Phủ một lớp kem mascarpone lên trên</li><li>Lặp lại thêm một lớp nữa</li><li>Rắc bột cacao lên trên cùng</li><li>Để trong tủ lạnh ít nhất 4 giờ trước khi thưởng thức</li></ol><p>Bánh Tiramisu hoàn thành sẽ có hương vị đậm đà, mịn màng và hoàn hảo cho những dịp đặc biệt!</p>', '/uploads/images/1754410590690-856084025-banner5.avif', 'published', NULL, '2025-08-04 17:48:25', '2025-08-05 16:16:31', 0),
(28, NULL, 'Bí quyết làm bánh Croissant giòn rụm kiểu Pháp', 'bi-quyet-lam-banh-croissant-gion-rum-kieu-phap', '<h2>Croissant - Bánh sừng bò nổi tiếng nước Pháp</h2><p>Croissant là một loại bánh sừng bò truyền thống của Pháp, có lớp vỏ giòn rụm bên ngoài và mềm mịn bên trong với hương vị bơ thơm béo đặc trưng.</p><h3>Nguyên liệu:</h3><ul><li>3 cup bột mì đa dụng</li><li>1/4 cup đường</li><li>1 tsp muối</li><li>1 cup sữa ấm</li><li>2 1/4 tsp men nở</li><li>1 cup bơ lạnh</li><li>1 quả trứng để quét mặt</li></ul><h3>Quy trình làm:</h3><ol><li>Trộn bột mì, đường, muối và men nở</li><li>Thêm sữa ấm và nhào bột cho đến khi mịn</li><li>Để bột nghỉ 1 giờ ở nhiệt độ phòng</li><li>Cán bột thành hình chữ nhật và đặt bơ lạnh vào giữa</li><li>Gấp bột và cán lại, lặp lại 3-4 lần</li><li>Cắt bột thành hình tam giác và cuộn lại</li><li>Để bột nghỉ thêm 30 phút</li><li>Quét trứng lên mặt và nướng ở 200°C trong 15-20 phút</li></ol><p>Croissant thành công sẽ có lớp vỏ giòn rụm, bên trong mềm mịn với các lớp bột xếp chồng lên nhau một cách hoàn hảo!</p>', '/uploads/images/1754410599950-748100457-Äáº§u báº¿p 1.jpg', 'published', NULL, '2025-08-04 17:48:25', '2025-08-05 16:16:40', 0),
(29, NULL, 'Cách làm bánh kem sinh nhật đẹp mắt và ngon miệng', 'cach-lam-banh-kem-sinh-nhat-dep-mat-va-ngon-mieng', '<h2>Bánh kem sinh nhật - Món quà ý nghĩa cho người thân</h2><p>Bánh kem sinh nhật không chỉ là món tráng miệng mà còn là món quà ý nghĩa thể hiện tình cảm dành cho người thân yêu trong những dịp đặc biệt.</p><h3>Nguyên liệu cho bánh bông lan:</h3><ul><li>4 quả trứng gà</li><li>1 cup đường</li><li>1 cup bột mì</li><li>1/2 cup sữa</li><li>1/4 cup dầu ăn</li><li>1 tsp vanilla extract</li></ul><h3>Nguyên liệu cho kem trang trí:</h3><ul><li>2 cup kem tươi</li><li>1/2 cup đường bột</li><li>1 tsp vanilla extract</li><li>Màu thực phẩm (tùy chọn)</li><li>Hoa quả tươi để trang trí</li></ul><h3>Cách làm:</h3><ol><li>Đánh bông trứng với đường cho đến khi hỗn hợp chuyển sang màu vàng nhạt</li><li>Rây bột mì và trộn đều</li><li>Thêm sữa, dầu ăn và vanilla, trộn nhẹ nhàng</li><li>Đổ vào khuôn và nướng ở 180°C trong 25-30 phút</li><li>Để bánh nguội hoàn toàn</li><li>Đánh bông kem tươi với đường bột</li><li>Phết kem lên bánh và trang trí theo ý thích</li></ol><p>Bánh kem sinh nhật hoàn thành sẽ có hương vị thơm ngon, mềm mịn và trang trí đẹp mắt, hoàn hảo cho mọi dịp sinh nhật!</p>', '/uploads/images/1754410623682-197302382-banner5.avif', 'published', NULL, '2025-08-04 17:48:25', '2025-08-05 16:17:04', 0),
(30, NULL, 'Những loại bánh ngọt phổ biến nhất tại Việt Nam', 'nhung-loai-banh-ngot-pho-bien-nhat-tai-viet-nam', '<h2>Khám phá văn hóa bánh ngọt Việt Nam</h2><p>Việt Nam có một nền văn hóa ẩm thực phong phú với nhiều loại bánh ngọt truyền thống và hiện đại. Hãy cùng khám phá những loại bánh được yêu thích nhất.</p><h3>1. Bánh bông lan</h3><p>Bánh bông lan là loại bánh cơ bản nhất, được làm từ bột mì, trứng, đường và sữa. Bánh có kết cấu mềm mịn, thơm ngon và dễ ăn.</p><h3>2. Bánh flan</h3><p>Bánh flan có nguồn gốc từ châu Âu nhưng đã được Việt hóa. Bánh được làm từ trứng, sữa và đường, có hương vị béo ngậy và mịn màng.</p><h3>3. Bánh tiramisu</h3><p>Mặc dù có nguồn gốc từ Ý, bánh tiramisu đã trở nên rất phổ biến tại Việt Nam nhờ hương vị đậm đà và kết cấu độc đáo.</p><h3>4. Bánh kem</h3><p>Bánh kem là loại bánh được trang trí đẹp mắt, thường được sử dụng trong các dịp đặc biệt như sinh nhật, cưới hỏi.</p><h3>5. Bánh quy</h3><p>Bánh quy có nhiều loại khác nhau, từ bánh quy bơ truyền thống đến các loại bánh quy hiện đại với nhiều hương vị khác nhau.</p><p>Mỗi loại bánh đều có những đặc điểm riêng và phù hợp với những dịp khác nhau. Việc lựa chọn bánh phù hợp sẽ giúp tạo nên những khoảnh khắc đáng nhớ!</p>', '/uploads/images/1754410632949-409604895-banner4.avif', 'published', NULL, '2025-08-04 17:48:25', '2025-08-05 16:17:13', 0),
(31, NULL, 'Lợi ích của việc tự làm bánh tại nhà', 'loi-ich-cua-viec-tu-lam-banh-tai-nha', '<h2>Tại sao nên tự làm bánh tại nhà?</h2><p>Tự làm bánh tại nhà không chỉ là một hoạt động thú vị mà còn mang lại nhiều lợi ích về sức khỏe và tinh thần.</p><h3>1. Đảm bảo chất lượng nguyên liệu</h3><p>Khi tự làm bánh, bạn có thể kiểm soát hoàn toàn các nguyên liệu sử dụng, đảm bảo sử dụng những nguyên liệu tươi ngon và an toàn.</p><h3>2. Tiết kiệm chi phí</h3><p>Tự làm bánh tại nhà thường rẻ hơn so với mua bánh từ tiệm, đặc biệt khi làm với số lượng lớn.</p><h3>3. Thỏa sức sáng tạo</h3><p>Bạn có thể tùy chỉnh công thức, thay đổi hương vị và trang trí theo ý thích của mình.</p><h3>4. Hoạt động gia đình</h3><p>Làm bánh cùng gia đình là một hoạt động thú vị, giúp gắn kết các thành viên và tạo nên những kỷ niệm đáng nhớ.</p><h3>5. Giảm stress</h3><p>Quá trình làm bánh đòi hỏi sự tập trung và tỉ mỉ, giúp bạn thư giãn và quên đi những căng thẳng trong cuộc sống.</p><h3>6. Học hỏi kỹ năng mới</h3><p>Làm bánh giúp bạn phát triển các kỹ năng như sự kiên nhẫn, tỉ mỉ và khả năng sáng tạo.</p><p>Với những lợi ích trên, việc tự làm bánh tại nhà thực sự là một hoạt động bổ ích và thú vị mà ai cũng nên thử!</p>', '/uploads/images/1754411581439-783952649-banner3.avif', 'published', NULL, '2025-08-04 17:48:25', '2025-08-05 16:33:02', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 7, '2025-06-22 00:30:50', '2025-06-22 00:30:50'),
(2, 8, '2025-06-22 10:33:12', '2025-06-22 10:33:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `image_url`, `created_at`, `updated_at`, `isDeleted`) VALUES
(7, 'bánh mì', 'bánh mì quá ngon', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/B%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png/500px-B%C3%A1nh_m%C3%AC_th%E1%BB%8Bt_n%C6%B0%E1%BB%9Bng.png', '2025-06-17 06:28:29', '2025-06-28 09:23:40', 0),
(11, 'bánh kem', 'bánh kem quá đỉnh', 'https://hoayeuthuong.com/hinh-hoa-tuoi/banh-kem-brodard/13771_banh-kem-sua-tuoi-chocolate-scm-mau.jpg', '2025-06-17 07:32:40', '2025-06-26 17:52:45', 0),
(19, 'bánh sôcla', 'ngon', 'https://thanhnien.mediacdn.vn/Uploaded/trantam/2022_11_17/anh-chup-man-hinh-2022-10-07-luc-172838-4541-9511.png', '2025-06-28 09:23:52', '2025-06-28 17:34:35', 0),
(20, 'bánh bông loan', 'bánh ngọt thơm mon', 'https://anhquanbakery.com/uploads/product_menu/full_banh-bong-lan-1660551369.jpg', '2025-07-12 15:31:36', '2025-08-03 16:28:06', 0),
(21, 'Bánh ngọt', 'bánh ngọt', 'https://anhquanbakery.com/uploads/product_menu/full_banh-ngot-1660550375.jpg', '2025-08-03 14:19:28', '2025-08-03 14:19:28', 0),
(38, 'Bánh bao', 'bánh bao', 'https://anhquanbakery.com/uploads/product_menu/full_banh-bao-1660551178.jpg', '2025-08-03 16:27:45', '2025-08-03 16:27:45', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `createdAt`, `updatedAt`) VALUES
(6, 'ffd', 'toanhvpd10466@gmail.com', 'cdfdf', 'cscsc', '2025-06-28 09:18:30', '2025-06-28 09:18:30'),
(7, 'ffd', 'toanhvpd10466@gmail.com', 'cdfdf', 'dfdfd', '2025-06-28 09:23:20', '2025-06-28 09:23:20'),
(8, 'bfbfbf', 'toanhvpd10466@gmail.com', 'chưa đăng nhập', 'gjg', '2025-06-29 04:47:40', '2025-06-29 04:47:40'),
(9, 'bánh kem', 'toanhvpd10466@gmail.com', 'sdsd', 'cscscsa', '2025-08-07 16:13:39', '2025-08-07 16:13:39'),
(10, 'vvvdvd', 'hvt1601@gmail.com', 'csc', 'đcdcd', '2025-08-07 16:38:10', '2025-08-07 16:38:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled','completed') DEFAULT 'pending',
  `shipping_address` text NOT NULL,
  `phone` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `note` text DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT 'cod',
  `payment_proof` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `shipping_address`, `phone`, `name`, `note`, `payment_method`, `payment_proof`, `created_at`, `updated_at`) VALUES
(1, 8, 200.00, 'pending', '70 hòa nam 2', '0987987998', '', NULL, 'cod', NULL, '2025-06-22 03:46:59', '2025-06-22 03:46:59'),
(2, 8, 200.00, 'pending', '70 hòa nam 2', '0987987987', '', NULL, 'cod', NULL, '2025-06-22 03:54:03', '2025-06-22 03:54:03'),
(3, 8, 200.00, 'pending', 'yyy', '557', '', NULL, 'cod', NULL, '2025-06-22 03:56:06', '2025-06-22 03:56:06'),
(4, 8, 400.00, 'pending', '7005 hg', '564475', '', NULL, 'cod', NULL, '2025-06-22 03:58:41', '2025-06-22 04:11:31'),
(5, 7, 860.06, 'processing', 'lhlfdfd', '44364', '', NULL, 'cod', NULL, '2025-06-22 06:21:44', '2025-06-23 17:45:06'),
(6, 7, 200.00, 'cancelled', '70 hòa nam 2', '098876523', '', NULL, 'cod', NULL, '2025-06-23 16:23:39', '2025-06-23 17:43:15'),
(7, 7, 200.00, 'cancelled', '70 gf', '452', '', NULL, 'cod', NULL, '2025-06-23 16:37:36', '2025-06-27 17:51:48'),
(8, 7, 400.00, 'cancelled', 'fdfewewf', 'ưewf', '', NULL, 'cod', NULL, '2025-06-23 16:38:31', '2025-06-23 17:21:31'),
(9, 7, 200.00, 'delivered', 'sfaff', '36657688', '', NULL, 'cod', NULL, '2025-06-23 16:39:47', '2025-06-23 16:40:24'),
(10, 7, 200.00, 'pending', 'fsgg4g', '45255785', '', NULL, 'bank', '/uploads/1750696990498-Screenshot 2025-06-19 150635.png', '2025-06-23 16:43:10', '2025-06-23 16:43:10'),
(11, 7, 430.00, 'pending', 'vdfdgg5', '65265', '', NULL, 'bank', '/uploads/1750697322180-Screenshot 2025-06-17 174452.png', '2025-06-23 16:48:42', '2025-06-23 16:48:42'),
(12, 7, 200.00, 'processing', 'fđ', 'gđ', '', NULL, 'bank', '/uploads/1750697483778-Screenshot 2025-06-17 223425.png', '2025-06-23 16:51:23', '2025-06-23 17:23:15'),
(13, 7, 200.00, 'cancelled', 'fdfd', 'fdfd', '', NULL, 'bank', '/uploads/1750698231314-Screenshot 2025-06-17 141950.png', '2025-06-23 17:03:51', '2025-06-23 17:09:35'),
(14, 7, 200.00, 'pending', 'cxcx', 'xcxx', '', NULL, 'bank', '/uploads/1750699327115-Screenshot 2025-06-17 223425.png', '2025-06-23 17:22:07', '2025-06-23 17:22:07'),
(15, 7, 200.00, 'shipped', 'vcv', 'vcv', '', NULL, 'bank', '/uploads/1750699505357-Screenshot 2025-06-17 232516.png', '2025-06-23 17:25:05', '2025-06-23 17:30:18'),
(17, 7, 200.00, 'cancelled', '70 hòa nam 2', '0987654321', '', NULL, 'cod', NULL, '2025-06-25 08:18:02', '2025-06-27 17:45:00'),
(18, 7, 4.00, 'cancelled', '70 hòa nam 2', '039510798', 'hứa văn toàn', 'hết tiền', 'cod', NULL, '2025-06-25 08:47:05', '2025-06-27 17:55:56'),
(19, 7, 200.00, 'cancelled', 'vân tiên , bình đào , thăng bình', '0395107987', 'hứa văn toàn', 'giao nhanh giúp mình', 'cod', NULL, '2025-06-27 15:17:12', '2025-06-27 17:45:24'),
(20, 7, 430.00, 'pending', 'tổv2', '0999999999', 'tèo', 'nhanh', 'bank', '/uploads/1751128822066-Screenshot 2025-06-17 141950.png', '2025-06-28 16:40:22', '2025-06-28 16:40:22'),
(21, 7, 860.00, 'pending', 'htht', 'htht', 'hthth', 'th', 'bank', '/uploads/1751172394653-banhmi.webp', '2025-06-29 04:46:34', '2025-06-29 04:46:34'),
(22, 7, 630.00, 'pending', 'tttt', '-0990', 'teeof em', 'ghg', 'bank', '/uploads/1751174732887-h4.jpg', '2025-06-29 05:25:32', '2025-06-29 05:25:32'),
(23, 7, 200.00, 'pending', 'gfgfg', 'gfgfg', 'gfgfg', 'mới đặt', 'bank', '/uploads/1751175008728-default-cake.jpg', '2025-06-29 05:30:08', '2025-06-29 05:30:08'),
(24, 7, 200.00, 'pending', 'vdvdv', 'vdvdv', 'vvdv', 'vdvd', 'bank', '/uploads/1751176058256-h3jpg.jpg', '2025-06-29 05:47:38', '2025-06-29 05:47:38'),
(25, 7, 430.00, 'pending', 'cvc', 'xcx', 'vv', 'cxc', 'bank', '/uploads/1751176591881-h3jpg.jpg', '2025-06-29 05:56:31', '2025-06-29 05:56:31'),
(26, 7, 450.00, 'pending', 'fdfd', '0987654321', 'tòe', 'nhanh', 'bank', '/uploads/1751179007219-Screenshot-2025-06-17-232516png.png', '2025-06-29 06:36:47', '2025-06-29 06:36:47'),
(29, 7, 10.00, 'processing', 'n ', 'm', 'jv', '', 'vnpay', NULL, '2025-07-09 17:18:20', '2025-07-09 17:18:53'),
(30, 7, 20.00, 'processing', 'czc', 'cz', 'cc', '', 'vnpay', NULL, '2025-07-09 17:20:19', '2025-07-09 17:23:33'),
(31, 7, 20.00, 'processing', 'dsd', 'dsds', 'd', 'sd', 'vnpay', NULL, '2025-07-09 17:25:48', '2025-07-09 17:26:27'),
(32, 7, 430.00, 'processing', 'vxv', 'xv', 'vxx', 'vxv', 'vnpay', NULL, '2025-07-09 17:31:13', '2025-07-09 17:31:37'),
(33, 7, 430.00, 'processing', ' x ', 'x ', 'x x ', ' vv', 'vnpay', NULL, '2025-07-09 17:35:02', '2025-07-09 17:35:40'),
(34, 7, 430.00, 'processing', 'gdg', 'gd', 'd', 'gd', 'vnpay', NULL, '2025-07-10 15:37:45', '2025-07-10 15:38:28'),
(35, 7, 200.00, 'processing', 'vd', 'vd', 'dv', 'vdv', 'vnpay', NULL, '2025-07-10 15:48:46', '2025-07-10 15:49:10'),
(36, 7, 10.00, 'pending', 'sds', 'dsds', 'dsd', 'sd', 'vnpay', NULL, '2025-07-11 15:52:44', '2025-07-11 15:52:44'),
(37, 7, 200.00, 'processing', 'cvcv', 'vc', 'vcv', 'vc', 'vnpay', NULL, '2025-07-11 15:56:12', '2025-07-11 15:56:45'),
(38, 7, 200.00, 'processing', 'vc', 'vc', 'cv', 'vc', 'vnpay', NULL, '2025-07-11 16:01:46', '2025-07-11 16:02:15'),
(39, 7, 200.00, 'processing', 'vd', 'vdv', 'vv', 'dvdv', 'vnpay', NULL, '2025-07-11 16:11:54', '2025-07-11 16:12:32'),
(40, 7, 200.00, 'pending', 'dfd', 'df', 'fdf', 'dfd', 'cod', NULL, '2025-07-11 16:17:40', '2025-07-11 16:17:40'),
(41, 7, 200.00, 'processing', 'dvdv', 'dvd', 'vdv', 'vd', 'vnpay', NULL, '2025-07-11 16:17:54', '2025-07-11 16:18:28'),
(42, 7, 430.00, 'processing', 'dvd', 'vdv', 'vv', 'dvdv', 'vnpay', NULL, '2025-07-11 16:28:32', '2025-07-11 16:29:05'),
(43, 7, 430.00, 'processing', 'vc', 'cvc', 'cv', 'c', 'vnpay', NULL, '2025-07-11 16:31:21', '2025-07-11 16:32:25'),
(44, 7, 430.00, 'processing', 'csc', 'cs', 'cs', 'csc', 'vnpay', NULL, '2025-07-11 16:50:05', '2025-07-11 16:52:29'),
(45, 7, 10.00, 'processing', 'sfs', 'fsfs', 'sf', 'sfs', 'vnpay', NULL, '2025-07-11 17:05:42', '2025-07-11 17:07:08'),
(46, 7, 10.00, 'processing', 'xvx', 'xv', 'v', 'x', 'vnpay', NULL, '2025-07-11 17:14:14', '2025-07-11 17:14:43'),
(47, 7, 200.00, 'pending', 'vcvc', 'vcv', 'cc', 'cv', 'vnpay', NULL, '2025-07-12 06:49:19', '2025-07-12 06:49:19'),
(48, 7, 200.00, 'pending', 'df', 'dfdf', 'vd', 'fd', 'vnpay', NULL, '2025-07-12 06:54:37', '2025-07-12 06:54:37'),
(49, 7, 10.00, 'cancelled', 'fdf', 'fdf', 'hứa văn toàn', 'đắt quá ạ', 'vnpay', NULL, '2025-07-12 06:57:47', '2025-07-12 06:58:39'),
(50, 7, 200.00, 'pending', 'gd', 'gdg', 'ggd', 'dg', 'vnpay', NULL, '2025-07-12 06:59:33', '2025-07-12 06:59:33'),
(51, 7, 200.00, 'processing', 'sds', 'dsđ', 'sd', 'ds', 'vnpay', NULL, '2025-07-12 07:10:56', '2025-07-12 07:11:26'),
(52, 7, 200.00, 'pending', 'fdfd', 'fd', 'hứa văn toàn ', 'fd', 'vnpay', NULL, '2025-07-12 07:28:01', '2025-07-12 07:28:01'),
(53, 7, 430.00, 'cancelled', 'faf', 'faaf', 'thôn tin đơn hàng chưa xác nhận thanh toán vnpay ạ', 'ffd', 'vnpay', NULL, '2025-07-12 07:29:03', '2025-07-12 07:31:24'),
(55, 7, 200.00, 'pending', 'cxc', 'cx', 'xx', 'cxcx', 'vnpay', NULL, '2025-07-12 07:43:34', '2025-07-12 07:43:34'),
(56, 7, 200.00, 'pending', 'cvc', 'vcvc', 'vcv', 'vv', 'cod', NULL, '2025-07-12 07:58:54', '2025-07-12 07:58:54'),
(57, 7, 200.00, 'pending', 'cvc', 'vc', 'vc', 'cv', 'vnpay', NULL, '2025-07-12 07:59:09', '2025-07-12 07:59:09'),
(58, 7, 210.00, 'pending', 'cvcc', 'vc', 'cc', 'vcv', 'vnpay', NULL, '2025-07-12 15:26:44', '2025-07-12 15:26:44'),
(60, 7, 400.00, 'cancelled', 'cvcv', 'vc', ' cv', 'không mua nữa', 'vnpay', NULL, '2025-07-20 04:24:23', '2025-07-20 04:25:27'),
(61, 7, 200.00, 'shipped', 'cxc', 'xcx', 'cxc', 'cx', 'vnpay', NULL, '2025-07-20 04:55:31', '2025-08-01 16:41:59'),
(62, 7, 10.00, 'pending', 'xcxc', 'xc', 'cxc', 'xcx', 'vnpay', NULL, '2025-07-20 04:56:39', '2025-07-20 04:56:39'),
(63, 7, 200.00, 'cancelled', 'cxc', 'xcx', 'xcx', 'không mua nữa', 'vnpay', NULL, '2025-07-20 04:59:55', '2025-07-20 05:01:00'),
(64, 7, 200.00, 'processing', 'scs', 'csc', 'ssc', 'ssc', 'vnpay', NULL, '2025-07-20 05:08:38', '2025-07-20 05:10:20'),
(65, 7, 400.00, 'processing', 'XCX', 'CX', 'XCXC', 'CXC', 'vnpay', NULL, '2025-07-20 06:12:24', '2025-07-20 06:13:30'),
(66, 7, 10.00, 'processing', 'cvc', 'cvc', 'vcv', 'vcc', 'vnpay', NULL, '2025-07-24 07:42:21', '2025-07-24 07:43:23'),
(67, 7, 200.00, 'cancelled', 'vcv', 'cvc', 'cvc', 'ko mua nữa', 'cod', NULL, '2025-07-24 07:54:25', '2025-07-24 07:54:35'),
(68, 7, 200.00, 'processing', 'cvc', 'vcv', 'cvcv', 'cvc', 'vnpay', NULL, '2025-07-24 07:55:09', '2025-07-24 07:55:33'),
(69, 7, 200.00, 'shipped', 'cvcv', 'cv', 'd', 'cvc', 'vnpay', NULL, '2025-07-24 07:59:06', '2025-08-01 16:40:10'),
(70, 7, 400.00, 'delivered', 'vcv', 'vcv', 'cvc', 'cvc', 'vnpay', NULL, '2025-07-27 02:41:08', '2025-08-01 16:38:40'),
(71, 7, 200.00, 'cancelled', 'GDGD', 'GDG', 'Đ', 'Order cancelled by user', 'vnpay', NULL, '2025-07-27 02:42:02', '2025-08-01 16:31:48'),
(72, 7, 1920.00, 'cancelled', 'hghgg', 'hghg', 'nghg', 'Order cancelled by user', 'vnpay', NULL, '2025-07-27 03:34:47', '2025-08-01 16:31:16'),
(73, 26, 30.00, 'completed', 'tổ 13', '0395107987', 'hứa văn toàn', 'Đơn hàng tạo trực tiếp tại cửa hàng', 'cod', NULL, '2025-08-01 04:47:52', '2025-08-01 16:31:39'),
(74, 27, 400.00, 'completed', 'đà nẵng', '0395107987', 'tô thị tèo', 'Đơn hàng tạo trực tiếp tại cửa hàng', 'cod', NULL, '2025-08-01 04:53:37', '2025-08-01 04:53:37'),
(75, 28, 200.00, 'completed', '70 hòa nam 2', '0987656543', 'lê văn đạt', 'Đơn hàng tạo trực tiếp tại cửa hàng', 'vnpay', NULL, '2025-08-01 04:54:11', '2025-08-01 04:54:11'),
(76, 29, 430.00, 'completed', 'nguyễn huy tưởng', '0395107987', 'vũ lê', 'Đơn hàng tạo trực tiếp tại cửa hàng', 'transfer', NULL, '2025-08-01 05:05:21', '2025-08-01 05:05:21'),
(78, 7, 630.00, 'cancelled', 'thth', 'tht', 'th', 'Order cancelled by user', 'vnpay', NULL, '2025-08-01 16:32:57', '2025-08-01 16:33:58'),
(81, 7, 50200.00, 'pending', 'fdsf', 'dfds', 'hf', 'df', 'cod', NULL, '2025-08-05 07:40:16', '2025-08-05 07:40:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`) VALUES
(23, 21, 7, 1, 430.00, '2025-06-29 04:46:34'),
(29, 25, 7, 1, 430.00, '2025-06-29 05:56:31'),
(30, 26, 7, 1, 430.00, '2025-06-29 06:36:47'),
(31, 26, 9, 1, 20.00, '2025-06-29 06:36:47'),
(35, 30, 9, 1, 20.00, '2025-07-09 17:20:19'),
(36, 31, 9, 1, 20.00, '2025-07-09 17:25:48'),
(37, 32, 7, 1, 430.00, '2025-07-09 17:31:13'),
(38, 33, 7, 1, 430.00, '2025-07-09 17:35:02'),
(39, 34, 7, 1, 430.00, '2025-07-10 15:37:45'),
(47, 42, 7, 1, 430.00, '2025-07-11 16:28:32'),
(48, 43, 7, 1, 430.00, '2025-07-11 16:31:21'),
(49, 44, 7, 1, 430.00, '2025-07-11 16:50:05'),
(58, 53, 7, 1, 430.00, '2025-07-12 07:29:03'),
(81, 72, 7, 3, 430.00, '2025-07-27 03:34:47'),
(85, 76, 7, 1, 430.00, '2025-08-01 05:05:21'),
(88, 78, 7, 1, 430.00, '2025-08-01 16:32:57'),
(90, 81, 32, 1, 200.00, '2025-08-05 07:40:16'),
(91, 81, 78, 2, 25000.00, '2025-08-05 07:40:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_codes`
--

CREATE TABLE `password_reset_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `password_reset_codes`
--

INSERT INTO `password_reset_codes` (`id`, `email`, `code`, `expires_at`, `created_at`) VALUES
(16, 'datnguyen@gmail.com', '378652', '2025-06-25 01:30:26', '2025-06-25 01:15:26');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
  `vnpay_transaction_no` varchar(255) DEFAULT NULL,
  `refund_transaction_no` varchar(255) DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refund_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `transaction_id`, `amount`, `status`, `vnpay_transaction_no`, `refund_transaction_no`, `refund_amount`, `refund_reason`, `created_at`, `updated_at`) VALUES
(1, 61, 'vnpay', NULL, 200.00, 'pending', NULL, NULL, NULL, NULL, '2025-07-20 04:55:31', '2025-07-20 04:55:31'),
(2, 62, 'vnpay', NULL, 10.00, 'pending', NULL, NULL, NULL, NULL, '2025-07-20 04:56:39', '2025-07-20 04:56:39'),
(3, 63, 'vnpay', NULL, 200.00, 'refunded', NULL, 'REFUND_1752987660444', 200.00, 'không mua nữa', '2025-07-20 04:59:55', '2025-07-20 05:01:00'),
(4, 64, 'vnpay', NULL, 200.00, 'completed', NULL, NULL, NULL, NULL, '2025-07-20 05:08:38', '2025-07-20 05:09:18'),
(5, 65, 'vnpay', NULL, 400.00, 'completed', NULL, NULL, NULL, NULL, '2025-07-20 06:12:24', '2025-07-20 06:12:42'),
(6, 66, 'vnpay', NULL, 10.00, 'completed', NULL, NULL, NULL, NULL, '2025-07-24 07:42:21', '2025-07-24 07:43:23'),
(7, 68, 'vnpay', NULL, 200.00, 'completed', NULL, NULL, NULL, NULL, '2025-07-24 07:55:09', '2025-07-24 07:55:33'),
(8, 69, 'vnpay', NULL, 200.00, 'pending', NULL, NULL, NULL, NULL, '2025-07-24 07:59:06', '2025-07-24 07:59:06'),
(9, 70, 'vnpay', NULL, 400.00, 'pending', NULL, NULL, NULL, NULL, '2025-07-27 02:41:08', '2025-07-27 02:41:08'),
(10, 71, 'vnpay', NULL, 200.00, 'refunded', NULL, 'REFUND_1754065908879', 200.00, 'Order cancelled by user', '2025-07-27 02:42:02', '2025-08-01 16:31:48'),
(11, 72, 'vnpay', NULL, 1920.00, 'refunded', NULL, 'REFUND_1754065876904', 1920.00, 'Order cancelled by user', '2025-07-27 03:34:47', '2025-08-01 16:31:16'),
(12, 75, 'vnpay', NULL, 200.00, 'pending', NULL, NULL, NULL, NULL, '2025-08-01 04:54:11', '2025-08-01 04:54:11'),
(13, 76, 'transfer', 'TRANSFER_1754024721285', 430.00, 'pending', NULL, NULL, NULL, NULL, '2025-08-01 05:05:21', '2025-08-01 05:05:21'),
(14, 78, 'vnpay', NULL, 630.00, 'refunded', NULL, 'REFUND_1754066038091', 630.00, 'Order cancelled by user', '2025-08-01 16:32:57', '2025-08-01 16:33:58');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0 COMMENT 'Sản phẩm nổi bật',
  `is_hot` tinyint(1) DEFAULT 0 COMMENT 'Sản phẩm hot/bán chạy',
  `discount_percent` int(11) DEFAULT 0 COMMENT 'Phần trăm giảm giá (0-100)',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT 'Giá gốc trước khi giảm giá',
  `view_count` int(11) DEFAULT 0,
  `rating_avg` decimal(3,2) DEFAULT 0.00,
  `rating_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `image_url`, `stock`, `created_at`, `updated_at`, `isDeleted`, `is_featured`, `is_hot`, `discount_percent`, `original_price`, `view_count`, `rating_avg`, `rating_count`) VALUES
(7, 19, 'bánh socola', 'quá đã', 430.00, '/uploads/1754245237696-banner2avif.avif', 36, '2025-06-21 16:42:43', '2025-08-04 17:56:40', 0, 0, 0, 0, NULL, 6, 0.00, 0),
(9, 7, 'bánh mì thịt ', 'ngon bổ rẻ', 20.00, '/uploads/1754293129313-banhmiwebp.webp', 12, '2025-06-28 15:37:21', '2025-08-04 17:05:47', 0, 0, 0, 0, NULL, 3577, 0.00, 0),
(13, 11, 'bánh kem', 'ngon', 200.00, '/uploads/1754293104526-h2jpg.jpg', 30, '2025-08-03 15:53:17', '2025-08-04 07:52:50', 0, 0, 0, 10, 300.00, 677, 0.00, 0),
(32, 38, 'bánh bao', 'ngon', 200.00, '/uploads/1754293212988-banner3avif.avif', 1, '2025-08-04 07:40:13', '2025-08-05 07:40:16', 0, 0, 0, 30, 300.00, 16, 0.00, 0),
(78, 38, 'Bánh bao nhân thịt', 'Bánh bao truyền thống với nhân thịt heo xay, hành lá và gia vị thơm ngon', 25000.00, '/uploads/1754368371823-bnh-baojpg.jpg', 48, '2025-08-04 17:48:25', '2025-08-07 18:02:50', 0, 0, 0, 0, NULL, 22, 0.00, 0),
(79, 38, 'Bánh bao nhân trứng muối', 'Bánh bao với nhân trứng muối béo ngậy, thịt xay và nấm', 30000.00, '/uploads/1754585809847-bnh-baojpg.jpg', 30, '2025-08-04 17:48:25', '2025-08-07 16:56:49', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(80, 38, 'Bánh bao chay', 'Bánh bao chay với nhân rau củ, nấm và đậu phụ', 20000.00, '/uploads/1754585817110-bnh-baojpg.jpg', 40, '2025-08-04 17:48:25', '2025-08-07 16:56:57', 0, 0, 0, 0, NULL, 4, 0.00, 0),
(81, 20, 'Bánh bông lan trứng muối', 'Bánh bông lan mềm mịn với trứng muối béo ngậy', 45000.00, '/uploads/1754585829798-h3jpg.jpg', 25, '2025-08-04 17:48:25', '2025-08-07 16:57:09', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(82, 20, 'Bánh bông lan socola', 'Bánh bông lan socola đen với kem socola', 50000.00, '/uploads/1754585879252-h5jpg.jpg', 35, '2025-08-04 17:48:25', '2025-08-07 16:57:59', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(83, 20, 'Bánh bông lan dừa', 'Bánh bông lan với hương vị dừa thơm ngon', 40000.00, '/uploads/1754585886428-h5jpg.jpg', 30, '2025-08-04 17:48:25', '2025-08-07 16:58:06', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(84, 11, 'Bánh kem socola', 'Bánh kem socola 2 tầng với kem tươi và socola đen', 250000.00, '/uploads/1754585904968-banner2avif.avif', 10, '2025-08-04 17:48:25', '2025-08-07 16:58:24', 0, 0, 0, 0, NULL, 4, 0.00, 0),
(85, 11, 'Bánh kem dâu tây', 'Bánh kem dâu tây tươi với kem whipping', 280000.00, '/uploads/1754585916529-default-cakejpg.jpg', 8, '2025-08-04 17:48:25', '2025-08-07 16:58:36', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(88, 7, 'Bánh mì thịt nướng', 'Bánh mì Việt Nam với thịt nướng, rau sống và sốt', 35000.00, '/uploads/1754585957813-banhmiwebp.webp', 40, '2025-08-04 17:48:25', '2025-08-07 16:59:17', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(89, 7, 'Bánh mì pate', 'Bánh mì với pate gan, thịt nguội và rau sống', 30000.00, '/uploads/1754585941316-banhmiwebp.webp', 50, '2025-08-04 17:48:25', '2025-08-07 16:59:01', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(90, 7, 'Bánh mì chả cá', 'Bánh mì với chả cá thơm ngon', 40000.00, '/uploads/1754585966150-banhmiwebp.webp', 35, '2025-08-04 17:48:25', '2025-08-07 16:59:26', 0, 0, 0, 0, NULL, 2, 0.00, 0),
(91, 7, 'Bánh mì xíu mại', 'Bánh mì với xíu mại và rau sống', 38000.00, '/uploads/1754586137814-banhmiwebp.webp', 30, '2025-08-04 17:48:25', '2025-08-07 17:02:17', 0, 0, 0, 0, NULL, 2, 0.00, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `parent_id` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `rating`, `content`, `created_at`, `updated_at`, `parent_id`, `status`) VALUES
(1, 7, 7, 5, 'cxc', '2025-06-27 16:11:41', '2025-08-05 08:05:26', NULL, 'approved'),
(4, 7, 13, 5, 'gfgfg', '2025-08-04 07:52:44', '2025-08-05 08:05:25', NULL, 'approved'),
(7, 7, 78, 5, 'ngon lắm ạ\n', '2025-08-05 04:34:49', '2025-08-05 04:47:24', NULL, 'approved');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `address`, `phone`, `role`, `created_at`, `updated_at`, `isDeleted`, `is_verified`) VALUES
(5, 'toan123', '123456', 'toan@example.com', 'Toàn Hứa', 'Hà Nội', '0123456789', 'user', '2025-08-03 14:34:55', '2025-08-03 14:34:55', 0, 1),
(7, 'teo', '$2b$10$Q7ztN8akZsGuWJAWd9oKSuefBNDAt3rYbIK5Z3HNztsMQGbxBS8Hu', 'toanhvpd10466@gmail.com', 'tô thị tèo', 'đà nẵng', '0000000001', 'admin', '2025-06-17 06:02:39', '2025-07-18 08:36:09', 0, 1),
(8, 'tèo em', '$2b$10$UacOpRTjxw.jSlx1zErz0.EFg7lcXuMzdVnuX8QsevV4BxhUp5qR6', 'toanhua@gmail.com', 'lê văn tèo', 'đà nẵng', '0395107987', 'user', '2025-06-20 16:32:09', '2025-07-18 10:14:42', 0, 0),
(9, 'tianh123', '$2b$10$uHXhobxDDsjvkIs71obGaOFexf1A5zQF.i3vJMN7PwvTwxgZReBZi', 'tianh123@gmail.com', 'toanhua', 'hà nội', '0395107987', 'user', '2025-06-24 15:48:40', '2025-06-24 15:48:40', 0, 0),
(10, 'datnguyen', '$2b$10$0OEK2VLlvAAaNKYFT8bsEuYkppiBqxzr0vw4CCHw8BrVp4MYqV/6.', 'datnguyen@gmail.com', 'nguyễn tiến đạt', 'quảng bình', '0987987987', 'user', '2025-06-24 17:19:14', '2025-06-24 17:19:14', 0, 0),
(11, 'vohuuvu', '$2b$10$m3/m3Dst47exaoECwtDtmuZVSBfTmqvVJWkVTGSjV9X0pXufAU/..', 'vuvo123@gmail.com', 'vũ hữu võ', 'hà tĩnh', '0987698764', 'user', '2025-06-25 07:12:08', '2025-07-06 03:33:14', 0, 0),
(20, 'vantoan', '$2b$10$8lc.NP.HMrOnp9Xy.NNQbOYfShSUepyFY8.N3H5RSC5IDgSYLi1Ui', 'datntpd11202@gmail.com', 'lê văn tèo', 'đà nẵng', '0395107987', 'user', '2025-07-06 17:31:07', '2025-07-06 17:31:07', 0, 0),
(23, 'toanhua', '$2b$10$uKclDZwl/3bXoQ/1FaHOIOButD/VdvlWzFSPSt8hSn10tTmb1TSEi', 'hvt1601@gmail.com', 'hứa văn toàn', 'tổ 13', '0395107987', 'user', '2025-07-20 06:17:18', '2025-07-20 06:17:45', 0, 1),
(24, 'datdeu', '$2b$10$OoNUnWazQfsOodDZ8LvMouiJ01mukLFc6byV85d.6y.lwcsBsTh9m', 'nguyentiendeu205@gmail.com', 'đạt nguyễn', 'hà tĩnh', '0395107987', 'user', '2025-07-24 07:17:29', '2025-07-24 07:17:29', 0, 0),
(25, 'tiendat', '$2b$10$DKqBcO3wFJvZzq0fN5xwqeOWPC.Ip/aVUIGfJqvmunYiJwq.1AqvO', 'vohuuvu28042005@gmail.com', 'nguyễn tiến đạt', 'hà tĩnh', '0395107987', 'user', '2025-07-24 07:19:47', '2025-07-24 07:19:47', 0, 0),
(26, 'guest_1754023672565', '$2b$10$..06IEHYnTXQPd1CFq9XQ.xz.xIetrvEU9CfLD7inyxbIWwLzFooq', 'guest_1754023672565@direct.com', 'hứa văn toàn', 'tổ 13', '0395107987', 'user', '2025-08-01 04:47:52', '2025-08-01 04:47:52', 0, 0),
(27, 'guest_1754024016895', '$2b$10$WqmBFVzIYdwGiQXq75HkwOVMGIOmQ0WCwt2lHPvZtBPJKcFgofJn.', 'guest_1754024016895@direct.com', 'tô thị tèo', 'đà nẵng', '0395107987', 'user', '2025-08-01 04:53:37', '2025-08-01 04:53:37', 0, 0),
(28, 'guest_1754024051863', '$2b$10$F6NZeaoWblRFLdLOoSt47eEpchdDRL8BNwaL0A4qVsg9BsY1J2PN2', 'guest_1754024051863@direct.com', 'lê văn đạt', '70 hòa nam 2', '0987656543', 'user', '2025-08-01 04:54:11', '2025-08-01 04:54:11', 0, 0),
(29, 'guest_1754024721183', '$2b$10$CdORQIsn.afQ1jKPWRr0eeUgF3bJnX8RuLZcaF4dIriVdK53MmTWe', 'guest_1754024721183@direct.com', 'vũ lê', 'nguyễn huy tưởng', '0395107987', 'user', '2025-08-01 05:05:21', '2025-08-05 05:42:17', 0, 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payments_order_id` (`order_id`),
  ADD KEY `idx_payments_status` (`status`),
  ADD KEY `idx_payments_vnpay_transaction` (`vnpay_transaction_no`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT cho bảng `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
