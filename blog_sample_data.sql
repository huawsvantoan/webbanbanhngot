-- Dữ liệu mẫu cho blog posts
-- Chạy file này để thêm bài viết mẫu vào database

-- Thêm bài viết blog mẫu
INSERT INTO blog_posts (user_id, title, slug, content, image_url, status, created_at, updated_at) VALUES
(1, 'Công thức làm bánh Tiramisu truyền thống', 'cong-thuc-lam-banh-tiramisu-truyen-thong', 
'<h2>Bánh Tiramisu - Món tráng miệng Ý nổi tiếng</h2>
<p>Tiramisu là một món tráng miệng truyền thống của Ý, được làm từ bánh ladyfinger thấm đẫm cà phê, kem mascarpone mịn màng và bột cacao đắng ngọt.</p>

<h3>Nguyên liệu cần thiết:</h3>
<ul>
<li>6 lòng đỏ trứng gà</li>
<li>1/2 cup đường</li>
<li>1 cup mascarpone cheese</li>
<li>1 cup kem tươi</li>
<li>24 bánh ladyfinger</li>
<li>1 cup cà phê đậm đặc</li>
<li>Bột cacao để rắc</li>
</ul>

<h3>Cách làm:</h3>
<ol>
<li>Đánh bông lòng đỏ trứng với đường cho đến khi hỗn hợp chuyển sang màu vàng nhạt</li>
<li>Thêm mascarpone và đánh đều</li>
<li>Đánh bông kem tươi riêng, sau đó trộn vào hỗn hợp mascarpone</li>
<li>Nhúng bánh ladyfinger vào cà phê và xếp một lớp dưới đáy khuôn</li>
<li>Phủ một lớp kem mascarpone lên trên</li>
<li>Lặp lại thêm một lớp nữa</li>
<li>Rắc bột cacao lên trên cùng</li>
<li>Để trong tủ lạnh ít nhất 4 giờ trước khi thưởng thức</li>
</ol>

<p>Bánh Tiramisu hoàn thành sẽ có hương vị đậm đà, mịn màng và hoàn hảo cho những dịp đặc biệt!</p>', 
'/images/blog-tiramisu.jpg', 'published', NOW(), NOW()),

(1, 'Bí quyết làm bánh Croissant giòn rụm kiểu Pháp', 'bi-quyet-lam-banh-croissant-gion-rum-kieu-phap',
'<h2>Croissant - Bánh sừng bò nổi tiếng nước Pháp</h2>
<p>Croissant là một loại bánh sừng bò truyền thống của Pháp, có lớp vỏ giòn rụm bên ngoài và mềm mịn bên trong với hương vị bơ thơm béo đặc trưng.</p>

<h3>Nguyên liệu:</h3>
<ul>
<li>3 cup bột mì đa dụng</li>
<li>1/4 cup đường</li>
<li>1 tsp muối</li>
<li>1 cup sữa ấm</li>
<li>2 1/4 tsp men nở</li>
<li>1 cup bơ lạnh</li>
<li>1 quả trứng để quét mặt</li>
</ul>

<h3>Quy trình làm:</h3>
<ol>
<li>Trộn bột mì, đường, muối và men nở</li>
<li>Thêm sữa ấm và nhào bột cho đến khi mịn</li>
<li>Để bột nghỉ 1 giờ ở nhiệt độ phòng</li>
<li>Cán bột thành hình chữ nhật và đặt bơ lạnh vào giữa</li>
<li>Gấp bột và cán lại, lặp lại 3-4 lần</li>
<li>Cắt bột thành hình tam giác và cuộn lại</li>
<li>Để bột nghỉ thêm 30 phút</li>
<li>Quét trứng lên mặt và nướng ở 200°C trong 15-20 phút</li>
</ol>

<p>Croissant thành công sẽ có lớp vỏ giòn rụm, bên trong mềm mịn với các lớp bột xếp chồng lên nhau một cách hoàn hảo!</p>',
'/images/blog-croissant.jpg', 'published', NOW(), NOW()),

(1, 'Cách làm bánh kem sinh nhật đẹp mắt và ngon miệng', 'cach-lam-banh-kem-sinh-nhat-dep-mat-va-ngon-mieng',
'<h2>Bánh kem sinh nhật - Món quà ý nghĩa cho người thân</h2>
<p>Bánh kem sinh nhật không chỉ là món tráng miệng mà còn là món quà ý nghĩa thể hiện tình cảm dành cho người thân yêu trong những dịp đặc biệt.</p>

<h3>Nguyên liệu cho bánh bông lan:</h3>
<ul>
<li>4 quả trứng gà</li>
<li>1 cup đường</li>
<li>1 cup bột mì</li>
<li>1/2 cup sữa</li>
<li>1/4 cup dầu ăn</li>
<li>1 tsp vanilla extract</li>
</ul>

<h3>Nguyên liệu cho kem trang trí:</h3>
<ul>
<li>2 cup kem tươi</li>
<li>1/2 cup đường bột</li>
<li>1 tsp vanilla extract</li>
<li>Màu thực phẩm (tùy chọn)</li>
<li>Hoa quả tươi để trang trí</li>
</ul>

<h3>Cách làm:</h3>
<ol>
<li>Đánh bông trứng với đường cho đến khi hỗn hợp chuyển sang màu vàng nhạt</li>
<li>Rây bột mì và trộn đều</li>
<li>Thêm sữa, dầu ăn và vanilla, trộn nhẹ nhàng</li>
<li>Đổ vào khuôn và nướng ở 180°C trong 25-30 phút</li>
<li>Để bánh nguội hoàn toàn</li>
<li>Đánh bông kem tươi với đường bột</li>
<li>Phết kem lên bánh và trang trí theo ý thích</li>
</ol>

<p>Bánh kem sinh nhật hoàn thành sẽ có hương vị thơm ngon, mềm mịn và trang trí đẹp mắt, hoàn hảo cho mọi dịp sinh nhật!</p>',
'/images/blog-birthday-cake.jpg', 'published', NOW(), NOW()),

(1, 'Những loại bánh ngọt phổ biến nhất tại Việt Nam', 'nhung-loai-banh-ngot-pho-bien-nhat-tai-viet-nam',
'<h2>Khám phá văn hóa bánh ngọt Việt Nam</h2>
<p>Việt Nam có một nền văn hóa ẩm thực phong phú với nhiều loại bánh ngọt truyền thống và hiện đại. Hãy cùng khám phá những loại bánh được yêu thích nhất.</p>

<h3>1. Bánh bông lan</h3>
<p>Bánh bông lan là loại bánh cơ bản nhất, được làm từ bột mì, trứng, đường và sữa. Bánh có kết cấu mềm mịn, thơm ngon và dễ ăn.</p>

<h3>2. Bánh flan</h3>
<p>Bánh flan có nguồn gốc từ châu Âu nhưng đã được Việt hóa. Bánh được làm từ trứng, sữa và đường, có hương vị béo ngậy và mịn màng.</p>

<h3>3. Bánh tiramisu</h3>
<p>Mặc dù có nguồn gốc từ Ý, bánh tiramisu đã trở nên rất phổ biến tại Việt Nam nhờ hương vị đậm đà và kết cấu độc đáo.</p>

<h3>4. Bánh kem</h3>
<p>Bánh kem là loại bánh được trang trí đẹp mắt, thường được sử dụng trong các dịp đặc biệt như sinh nhật, cưới hỏi.</p>

<h3>5. Bánh quy</h3>
<p>Bánh quy có nhiều loại khác nhau, từ bánh quy bơ truyền thống đến các loại bánh quy hiện đại với nhiều hương vị khác nhau.</p>

<p>Mỗi loại bánh đều có những đặc điểm riêng và phù hợp với những dịp khác nhau. Việc lựa chọn bánh phù hợp sẽ giúp tạo nên những khoảnh khắc đáng nhớ!</p>',
'/images/blog-vietnamese-cakes.jpg', 'published', NOW(), NOW()),

(1, 'Lợi ích của việc tự làm bánh tại nhà', 'loi-ich-cua-viec-tu-lam-banh-tai-nha',
'<h2>Tại sao nên tự làm bánh tại nhà?</h2>
<p>Tự làm bánh tại nhà không chỉ là một hoạt động thú vị mà còn mang lại nhiều lợi ích về sức khỏe và tinh thần.</p>

<h3>1. Đảm bảo chất lượng nguyên liệu</h3>
<p>Khi tự làm bánh, bạn có thể kiểm soát hoàn toàn các nguyên liệu sử dụng, đảm bảo sử dụng những nguyên liệu tươi ngon và an toàn.</p>

<h3>2. Tiết kiệm chi phí</h3>
<p>Tự làm bánh tại nhà thường rẻ hơn so với mua bánh từ tiệm, đặc biệt khi làm với số lượng lớn.</p>

<h3>3. Thỏa sức sáng tạo</h3>
<p>Bạn có thể tùy chỉnh công thức, thay đổi hương vị và trang trí theo ý thích của mình.</p>

<h3>4. Hoạt động gia đình</h3>
<p>Làm bánh cùng gia đình là một hoạt động thú vị, giúp gắn kết các thành viên và tạo nên những kỷ niệm đáng nhớ.</p>

<h3>5. Giảm stress</h3>
<p>Quá trình làm bánh đòi hỏi sự tập trung và tỉ mỉ, giúp bạn thư giãn và quên đi những căng thẳng trong cuộc sống.</p>

<h3>6. Học hỏi kỹ năng mới</h3>
<p>Làm bánh giúp bạn phát triển các kỹ năng như sự kiên nhẫn, tỉ mỉ và khả năng sáng tạo.</p>

<p>Với những lợi ích trên, việc tự làm bánh tại nhà thực sự là một hoạt động bổ ích và thú vị mà ai cũng nên thử!</p>',
'/images/blog-home-baking.jpg', 'published', NOW(), NOW());

-- Cập nhật thời gian tạo để có sự khác biệt về ngày
UPDATE blog_posts SET created_at = DATE_SUB(NOW(), INTERVAL 5 DAY) WHERE id = 1;
UPDATE blog_posts SET created_at = DATE_SUB(NOW(), INTERVAL 10 DAY) WHERE id = 2;
UPDATE blog_posts SET created_at = DATE_SUB(NOW(), INTERVAL 15 DAY) WHERE id = 3;
UPDATE blog_posts SET created_at = DATE_SUB(NOW(), INTERVAL 20 DAY) WHERE id = 4;
UPDATE blog_posts SET created_at = DATE_SUB(NOW(), INTERVAL 25 DAY) WHERE id = 5; 