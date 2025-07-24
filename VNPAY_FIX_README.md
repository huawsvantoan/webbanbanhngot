# VNPAY Payment Refund System

## Tính năng đã thêm:

### 1. Bảng `payments` trong database
```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  vnpay_transaction_no VARCHAR(255),
  refund_transaction_no VARCHAR(255),
  refund_amount DECIMAL(10, 2) NULL,
  refund_reason VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

### 2. Model Payment
- `Payment.create()` - Tạo payment record
- `Payment.findByOrderId()` - Tìm payment theo order ID
- `Payment.updateStatus()` - Cập nhật trạng thái payment
- `Payment.updateRefund()` - Cập nhật thông tin hoàn tiền

### 3. API Endpoints
- `POST /api/payment/vnpay/refund` - Hoàn tiền VNPAY
- `GET /api/payment/order/:orderId` - Lấy thông tin payment

### 4. Logic tự động hoàn tiền
Khi hủy đơn hàng:
1. Kiểm tra payment method có phải VNPAY không
2. Kiểm tra payment status có 'completed' không
3. Gọi API hoàn tiền VNPAY
4. Cập nhật payment status thành 'refunded'
5. Cập nhật order status thành 'cancelled'

### 5. Frontend Service
- `paymentService.getOrderPayment()` - Lấy thông tin payment
- `paymentService.refundVnpayPayment()` - Hoàn tiền VNPAY

## Cách sử dụng:

### Chạy migration database:
```bash
mysql -u root -p < update_database.sql
```

### Test hoàn tiền:
1. Tạo đơn hàng với payment_method = 'vnpay'
2. Thanh toán thành công (status = 'completed')
3. Hủy đơn hàng → Tự động hoàn tiền

### API hoàn tiền thủ công:
```javascript
// Gọi API hoàn tiền
const response = await fetch('/api/payment/vnpay/refund', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    orderId: 123,
    reason: 'Order cancelled by user'
  })
});
```

## Lưu ý:
- Hiện tại đang dùng mock refund (sandbox)
- Trong production cần gọi API thật của VNPAY
- Cần test kỹ trước khi deploy 