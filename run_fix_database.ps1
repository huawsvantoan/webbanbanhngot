# Script PowerShell để cập nhật database webbanhngot
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    CAP NHAT DATABASE WEBBANHNGOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Dang cap nhat database voi cac truong moi..." -ForegroundColor Yellow
Write-Host ""

# Thay đổi đường dẫn MySQL theo máy của bạn
# Nếu dùng XAMPP: "C:\xampp\mysql\bin\mysql.exe"
# Nếu dùng WAMP: "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
# Nếu dùng standalone MySQL: "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"

# Kiểm tra xem MySQL có tồn tại không
if (-not (Test-Path $mysqlPath)) {
    Write-Host "Khong tim thay MySQL tai: $mysqlPath" -ForegroundColor Red
    Write-Host "Hay chinh sua duong dan MySQL trong file nay" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Cac duong dan thuong gap:" -ForegroundColor Yellow
    Write-Host "- XAMPP: C:\xampp\mysql\bin\mysql.exe" -ForegroundColor White
    Write-Host "- WAMP: C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" -ForegroundColor White
    Write-Host "- Standalone: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ForegroundColor White
    Read-Host "Nhan Enter de thoat"
    exit 1
}

Write-Host "Chay script SQL..." -ForegroundColor Green

try {
    # Chạy script SQL
    $process = Start-Process -FilePath $mysqlPath -ArgumentList "-u", "root", "-p" -RedirectStandardInput "fix_database.sql" -NoNewWindow -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "    CAP NHAT THANH CONG!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Database da duoc cap nhat voi cac truong moi:" -ForegroundColor White
        Write-Host "- is_featured: San pham noi bat" -ForegroundColor White
        Write-Host "- is_hot: San pham ban chay (HOT)" -ForegroundColor White
        Write-Host "- discount_percent: Phan tram giam gia" -ForegroundColor White
        Write-Host "- original_price: Gia goc truoc khi giam" -ForegroundColor White
        Write-Host "- view_count: So luot xem" -ForegroundColor White
        Write-Host "- rating_avg: Diem danh gia trung binh" -ForegroundColor White
        Write-Host "- rating_count: So luong danh gia" -ForegroundColor White
        Write-Host ""
        Write-Host "Bay gio ban co the:" -ForegroundColor Yellow
        Write-Host "1. Khoi dong lai server" -ForegroundColor White
        Write-Host "2. Vao trang admin de them san pham moi" -ForegroundColor White
        Write-Host "3. Kiem tra trang san pham nguoi dung" -ForegroundColor White
        Write-Host ""
    } else {
        throw "MySQL process exited with code $($process.ExitCode)"
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "    LOI CAP NHAT DATABASE!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Co loi xay ra khi cap nhat database." -ForegroundColor Red
    Write-Host "Hay kiem tra:" -ForegroundColor Yellow
    Write-Host "1. MySQL da duoc cai dat va chay" -ForegroundColor White
    Write-Host "2. Duong dan MySQL trong file nay dung" -ForegroundColor White
    Write-Host "3. Mat khau MySQL dung" -ForegroundColor White
    Write-Host ""
    Write-Host "Chi tiet loi: $_" -ForegroundColor Red
    Write-Host ""
}

Read-Host "Nhan Enter de thoat" 