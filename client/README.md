# Hệ Thống Bán Hàng Trực Tuyến - Bakery Store

## Mô tả
Hệ thống bán hàng trực tuyến cho tiệm bánh với đầy đủ tính năng quản lý sản phẩm, đơn hàng, người dùng và đánh giá.

## Tính năng chính

### Cho Khách hàng chưa đăng nhập (Guest):
- ✅ Xem danh sách sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Tìm kiếm sản phẩm
- ✅ Xem banner/slider
- ✅ Xem đánh giá sản phẩm
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập

### Cho Khách hàng đã đăng nhập (Customer):
- ✅ Cập nhật thông tin cá nhân
- ✅ Đổi mật khẩu
- ✅ Đăng xuất
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Cập nhật số lượng giỏ hàng
- ✅ Xóa sản phẩm khỏi giỏ hàng
- ✅ Xem giỏ hàng
- ✅ Đặt hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Hủy đơn hàng (nếu chưa thanh toán)
- ✅ Đánh giá sản phẩm
- ✅ Bình luận về sản phẩm
- ✅ Chỉnh sửa đánh giá/bình luận
- ✅ Xóa đánh giá/bình luận

### Cho Quản trị viên (Admin):
- ✅ Thêm sản phẩm mới
- ✅ Cập nhật thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Quản lý danh mục sản phẩm
- ✅ Xem danh sách đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Xem chi tiết đơn hàng
- ✅ Hủy đơn hàng
- ✅ Xem danh sách khách hàng
- ✅ Khóa/Mở khóa tài khoản
- ✅ Xem thông tin chi tiết khách hàng
- ✅ Quản lý banner/slider
- ✅ Quản lý đánh giá/bình luận

## Công nghệ sử dụng

### Backend:
- Node.js + Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcrypt (mã hóa mật khẩu)

### Frontend:
- React.js + TypeScript
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Router (Routing)
- React Hot Toast (Notifications)

## Cài đặt và chạy

### 1. Clone repository
```bash
git clone <repository-url>
cd webbanhngot
```

### 2. Cài đặt dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Cấu hình database
- Tạo database MySQL
- Import file `database.sql` để tạo bảng và dữ liệu mẫu
- Cập nhật thông tin kết nối database trong `server/src/config/database.ts`

### 4. Cấu hình environment variables
Tạo file `.env` trong thư mục `server`:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 5. Chạy ứng dụng
```bash
# Backend (từ thư mục server)
npm run dev

# Frontend (từ thư mục client)
npm start
```

## Cấu trúc thư mục

```
webbanhngot/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── layouts/       # Layout components
│   │   ├── routes/        # Routing configuration
│   │   └── types/         # TypeScript types
│   └── public/            # Static files
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── uploads/           # Uploaded files
└── database.sql           # Database schema
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile
- `GET /api/auth/users` - Lấy danh sách users (Admin)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy chi tiết danh mục
- `POST /api/categories` - Tạo danh mục mới (Admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (Admin)
- `DELETE /api/categories/:id` - Xóa danh mục (Admin)

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ hàng
- `PUT /api/cart/items/:productId` - Cập nhật số lượng
- `DELETE /api/cart/items/:productId` - Xóa sản phẩm khỏi giỏ hàng

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)

### Reviews
- `GET /api/products/:productId/reviews` - Lấy đánh giá sản phẩm
- `POST /api/products/:productId/reviews` - Tạo đánh giá
- `PUT /api/reviews/:reviewId` - Cập nhật đánh giá
- `DELETE /api/reviews/:reviewId` - Xóa đánh giá

### Comments
- `GET /api/products/:productId/comments` - Lấy bình luận sản phẩm
- `POST /api/products/:productId/comments` - Tạo bình luận
- `PUT /api/comments/:commentId` - Cập nhật bình luận
- `DELETE /api/comments/:commentId` - Xóa bình luận

## Tài khoản mẫu

### Admin:
- Email: admin@example.com
- Password: admin123

### Customer:
- Email: customer@example.com
- Password: customer123

## Tính năng nổi bật

1. **Hệ thống đánh giá và bình luận**: Khách hàng có thể đánh giá sản phẩm bằng sao và viết bình luận
2. **Quản lý giỏ hàng**: Thêm, cập nhật, xóa sản phẩm trong giỏ hàng
3. **Quản lý đơn hàng**: Theo dõi trạng thái đơn hàng từ đặt hàng đến giao hàng
4. **Dashboard Admin**: Giao diện quản trị với thống kê và quản lý toàn diện
5. **Responsive Design**: Giao diện tương thích với mọi thiết bị
6. **Bảo mật**: JWT authentication, mã hóa mật khẩu, phân quyền người dùng

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.