# 🍰 Website Bánh Ngọt - Sweet Cake Shop

Website bán bánh ngọt handmade với đầy đủ chức năng quản lý, giỏ hàng, thanh toán và blog.

## ✨ Tính năng chính

### 🛍️ **Frontend (Client)**
- **Trang chủ**: Banner, sản phẩm nổi bật, danh mục, blog posts
- **Sản phẩm**: Danh sách, tìm kiếm, lọc theo danh mục, phân trang
- **Giỏ hàng**: Thêm/sửa/xóa sản phẩm, tính tổng tiền
- **Thanh toán**: VNPay, chuyển khoản, tiền mặt
- **Blog**: Bài viết, phân trang, tìm kiếm
- **Liên hệ**: Form liên hệ với validation
- **Đăng nhập/Đăng ký**: Xác thực JWT

### 🔧 **Backend (Server)**
- **API RESTful**: Express.js + TypeScript
- **Database**: MySQL với connection pool
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer với validation
- **Payment**: Tích hợp VNPay
- **Email**: Nodemailer cho thông báo

### 👨‍💼 **Admin Panel**
- **Dashboard**: Thống kê tổng quan
- **Quản lý sản phẩm**: CRUD, upload ảnh, quản lý kho
- **Quản lý đơn hàng**: Xem, cập nhật trạng thái, thêm mới
- **Quản lý danh mục**: CRUD, upload ảnh
- **Quản lý banner**: CRUD, upload ảnh
- **Quản lý blog**: CRUD, rich text editor
- **Quản lý người dùng**: Xem danh sách, phân quyền
- **Quản lý đánh giá**: Duyệt, xóa đánh giá

## 🚀 Cài đặt và chạy dự án

### **Yêu cầu hệ thống**
- Node.js >= 16.0.0
- MySQL >= 8.0
- Git

### **Bước 1: Clone dự án**
```bash
git clone <your-repository-url>
cd webbanhngot
```

### **Bước 2: Cài đặt dependencies**

#### **Client (Frontend)**
```bash
cd client
npm install
```

#### **Server (Backend)**
```bash
cd server
npm install
```

### **Bước 3: Cấu hình Database**

#### **Tạo database MySQL**
```sql
CREATE DATABASE webbanhngot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### **Import dữ liệu**
```bash
# Copy file SQL từ thư mục gốc vào MySQL
mysql -u root -p webbanhngot < "webbanhngot (4).sql"
```

#### **Cấu hình kết nối database**
```bash
cd server
# Tạo file .env từ .env.example (nếu có)
# Hoặc cập nhật trực tiếp trong src/config/database.ts
```

### **Bước 4: Cấu hình môi trường**

#### **Server (.env)**
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=webbanhngot
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server Port
PORT=5000

# VNPay Configuration
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_HASH_SECRET=your_vnpay_hash_secret
VNPAY_URL=your_vnpay_url

# Email Configuration (nếu sử dụng)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### **Bước 5: Chạy dự án**

#### **Chạy Server (Backend)**
```bash
cd server
npm run dev
# Server sẽ chạy tại http://localhost:5000
```

#### **Chạy Client (Frontend)**
```bash
cd client
npm start
# Client sẽ chạy tại http://localhost:3000
```

## 📁 Cấu trúc thư mục

```
webbanhngot/
├── client/                 # Frontend React
│   ├── public/            # Static files
│   │   ├── images/        # Default images
│   │   └── index.html
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── types/         # TypeScript types
│   │   └── validations/   # Yup schemas
│   └── package.json
├── server/                 # Backend Express
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   ├── uploads/           # Uploaded files
│   │   ├── images/        # Product/Category images
│   │   └── products/      # Product images
│   └── package.json
└── README.md
```

## 🔑 Tài khoản mặc định

### **Admin**
- **Email**: admin@example.com
- **Password**: admin123

### **User thường**
- **Email**: user@example.com
- **Password**: user123

## 📸 Hình ảnh và Media

### **Thư mục uploads quan trọng**
```
server/uploads/
├── images/          # Banner, Category images
├── products/        # Product images
└── .gitkeep         # Giữ thư mục trong git
```

### **Thư mục public images**
```
client/public/images/
├── default-cake.jpg     # Ảnh mặc định
├── banner1.jpg         # Banner mẫu
├── logo20shop.jpg      # Logo shop
└── ...                 # Các ảnh khác
```

## 🚨 Lưu ý quan trọng

### **1. File uploads phải có đầy đủ**
- **Không xóa** thư mục `server/uploads/`
- **Không xóa** thư mục `client/public/images/`
- Các file này chứa hình ảnh sản phẩm, banner, danh mục

### **2. Database phải có dữ liệu**
- Import file SQL để có sản phẩm, danh mục, banner mẫu
- Không có dữ liệu → website sẽ trống

### **3. Port phải đúng**
- **Server**: Port 5000
- **Client**: Port 3000
- **MySQL**: Port 3306 (mặc định)

### **4. CORS và API URL**
- Client gọi API tại `http://localhost:5000`
- Server đã cấu hình CORS cho localhost:3000

## 🐛 Xử lý lỗi thường gặp

### **Lỗi "Cannot connect to database"**
```bash
# Kiểm tra MySQL service
sudo service mysql status

# Kiểm tra thông tin kết nối trong server/src/config/database.ts
```

### **Lỗi "Port already in use"**
```bash
# Tìm process đang sử dụng port
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

### **Lỗi "Module not found"**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### **Lỗi "Image not displaying"**
- Kiểm tra thư mục `server/uploads/` có tồn tại
- Kiểm tra server có chạy tại port 5000
- Kiểm tra static files được serve đúng

## 📱 Tính năng nâng cao

### **Responsive Design**
- Mobile-first approach
- Tailwind CSS với breakpoints
- Framer Motion animations

### **Performance**
- Lazy loading images
- Code splitting
- Redux Toolkit với RTK Query
- Optimized bundle size

### **Security**
- JWT authentication
- Input validation (Yup)
- SQL injection prevention
- File upload validation

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 📞 Liên hệ

- **Email**: your-email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

---

**Lưu ý**: Đây là dự án demo, vui lòng thay đổi các thông tin nhạy cảm (JWT secret, database password, API keys) trước khi deploy production. 