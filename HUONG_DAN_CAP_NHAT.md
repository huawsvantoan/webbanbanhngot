# HƯỚNG DẪN CẬP NHẬT DATABASE

## Vấn đề
Hiện tại trang sản phẩm người dùng chưa hiển thị các thông tin:
- ✅ Sản phẩm nổi bật (Featured)
- ✅ Sản phẩm bán chạy (HOT)
- ✅ Phần trăm giảm giá (%)
- ✅ Giá gốc (trước khi giảm)

## Nguyên nhân
Database chưa có các cột mới để lưu trữ thông tin này.

## Giải pháp

### Bước 1: Cập nhật Database
Chạy một trong các script sau:

#### Cách 1: Sử dụng file .bat (Windows)
```bash
# Double-click vào file này
run_fix_database.bat
```

#### Cách 2: Sử dụng PowerShell
```powershell
# Mở PowerShell và chạy
.\run_fix_database.ps1
```

#### Cách 3: Chạy thủ công
```bash
# Mở Command Prompt và chạy
mysql -u root -p < fix_database.sql
```

### Bước 2: Kiểm tra kết quả
Sau khi chạy script, bạn sẽ thấy:
- ✅ Thêm 7 cột mới vào bảng `products`
- ✅ Cập nhật dữ liệu mẫu cho 6 sản phẩm đầu tiên
- ✅ Hiển thị kết quả để kiểm tra

### Bước 3: Khởi động lại Server
```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
cd server
npm start
```

### Bước 4: Kiểm tra
1. **Trang Admin**: Vào `http://localhost:3000/admin/products/new`
   - Kiểm tra form thêm sản phẩm có các trường mới
   - Thử thêm sản phẩm mới với các thông tin này

2. **Trang Sản phẩm**: Vào `http://localhost:3000/products`
   - Kiểm tra xem có hiển thị:
     - Badge "Nổi Bật" cho sản phẩm featured
     - Badge "HOT" cho sản phẩm hot
     - Badge "-X%" cho sản phẩm có giảm giá
     - Giá gốc (gạch ngang) cho sản phẩm có giảm giá

## Các trường mới được thêm

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| `is_featured` | BOOLEAN | Sản phẩm nổi bật |
| `is_hot` | BOOLEAN | Sản phẩm bán chạy (HOT) |
| `discount_percent` | INT | Phần trăm giảm giá (0-100) |
| `original_price` | DECIMAL(10,2) | Giá gốc trước khi giảm |
| `view_count` | INT | Số lượt xem sản phẩm |
| `rating_avg` | DECIMAL(3,2) | Điểm đánh giá trung bình |
| `rating_count` | INT | Số lượng đánh giá |

## Dữ liệu mẫu
Script sẽ cập nhật 6 sản phẩm đầu tiên với dữ liệu mẫu:
- Sản phẩm 1: Featured + HOT + 15% giảm giá
- Sản phẩm 2: Featured + 10% giảm giá  
- Sản phẩm 3: HOT + 20% giảm giá
- Sản phẩm 4: Featured + HOT (không giảm giá)
- Sản phẩm 5: 5% giảm giá
- Sản phẩm 6: Featured (không giảm giá)

## Troubleshooting

### Lỗi "Không tìm thấy MySQL"
1. Kiểm tra đường dẫn MySQL trong file script
2. Thay đổi đường dẫn theo máy của bạn:
   - XAMPP: `C:\xampp\mysql\bin\mysql.exe`
   - WAMP: `C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe`
   - Standalone: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`

### Lỗi "Access denied"
1. Kiểm tra mật khẩu MySQL
2. Đảm bảo user có quyền truy cập database `webbanhngot`

### Lỗi "Database not found"
1. Đảm bảo database `webbanhngot` đã được tạo
2. Chạy script `database.sql` trước nếu chưa có database

## Kết quả mong đợi
Sau khi hoàn thành, trang sản phẩm sẽ hiển thị:
- 🏷️ Badge màu tím cho sản phẩm nổi bật
- 🔥 Badge màu đỏ cho sản phẩm HOT
- 💚 Badge màu xanh cho phần trăm giảm giá
- ~~Giá gốc~~ (gạch ngang) cho sản phẩm có giảm giá 