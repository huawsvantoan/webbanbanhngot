# Hướng dẫn Setup và Chạy Dự án Web Bán Bánh Ngọt

## Yêu cầu hệ thống
- Node.js (version 16 trở lên)
- MySQL (version 8.0 trở lên)
- Git

## Bước 1: Clone và Setup dự án

```bash
# Clone dự án (nếu chưa có)
git clone <repository-url>
cd webbanhngot

# Cài đặt dependencies cho cả client và server
npm install
cd client && npm install
cd ../server && npm install
```

## Bước 2: Setup Database

1. Tạo database MySQL:
```sql
CREATE DATABASE webbanhngot;
USE webbanhngot;
```

2. Import schema database:
```bash
mysql -u root -p webbanhngot < database.sql
```

3. Import dữ liệu mẫu (tùy chọn):
```bash
mysql -u root -p webbanhngot < sample_data.sql
```

## Bước 3: Cấu hình Environment

1. Tạo file `.env` trong thư mục `server`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=webbanhngot
JWT_SECRET=your_jwt_secret_key
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/payment-success
```

2. Cập nhật thông tin database trong `server/src/config/database.ts` nếu cần.

## Bước 4: Chạy dự án

### Chạy Server (Backend)
```bash
cd server
npm run dev
```
Server sẽ chạy tại: http://localhost:5000

### Chạy Client (Frontend)
```bash
cd client
npm start
```
Client sẽ chạy tại: http://localhost:3000

## Bước 5: Truy cập ứng dụng

1. **Trang chủ**: http://localhost:3000
2. **Admin Panel**: http://localhost:3000/admin
   - Username: admin
   - Password: admin123

## Các tính năng chính

### Cho khách hàng:
- Đăng ký/Đăng nhập
- Xem danh sách sản phẩm
- Tìm kiếm và lọc sản phẩm
- Thêm vào giỏ hàng
- Đặt hàng và thanh toán
- Theo dõi đơn hàng
- Đánh giá sản phẩm

### Cho admin:
- Dashboard thống kê
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý danh mục
- Quản lý banner
- Quản lý blog

## Troubleshooting

### Lỗi PowerShell
Nếu gặp lỗi với lệnh `&&` trong PowerShell, sử dụng:
```powershell
cd client; npm start
cd server; npm run dev
```

### Lỗi Database
- Kiểm tra kết nối database trong `server/src/config/database.ts`
- Đảm bảo MySQL service đang chạy
- Kiểm tra thông tin đăng nhập database

### Lỗi Port
- Đảm bảo port 3000 và 5000 không bị sử dụng
- Có thể thay đổi port trong file cấu hình

## Cấu trúc dự án

```
webbanhngot/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── store/         # Redux store
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
├── database.sql           # Database schema
├── sample_data.sql        # Sample data
└── README.md             # Project documentation
```

## Tính năng Analytics

Dự án có tính năng thống kê chi tiết bao gồm:
- Doanh thu theo thời gian
- Số lượng đơn hàng
- Khách hàng mới
- Sản phẩm bán chạy
- Hiệu suất danh mục
- Biểu đồ tăng trưởng

Truy cập: http://localhost:3000/admin/analytics 