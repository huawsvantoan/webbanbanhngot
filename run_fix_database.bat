@echo off
echo ========================================
echo    CAP NHAT DATABASE WEBBANHNGOT
echo ========================================
echo.
echo Dang cap nhat database voi cac truong moi...
echo.

REM Thay doi duong dan MySQL theo may cua ban
REM Neu dung XAMPP: "C:\xampp\mysql\bin\mysql.exe"
REM Neu dung WAMP: "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
REM Neu dung standalone MySQL: "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"

REM Kiem tra xem MySQL co ton tai khong
if not exist %MYSQL_PATH% (
    echo Khong tim thay MySQL tai: %MYSQL_PATH%
    echo Hay chinh sua duong dan MySQL trong file nay
    echo.
    echo Cac duong dan thuong gap:
    echo - XAMPP: C:\xampp\mysql\bin\mysql.exe
    echo - WAMP: C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe
    echo - Standalone: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    pause
    exit /b 1
)

echo Chay script SQL...
%MYSQL_PATH% -u root -p < fix_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    CAP NHAT THANH CONG!
    echo ========================================
    echo.
    echo Database da duoc cap nhat voi cac truong moi:
    echo - is_featured: San pham noi bat
    echo - is_hot: San pham ban chay (HOT)
    echo - discount_percent: Phan tram giam gia
    echo - original_price: Gia goc truoc khi giam
    echo - view_count: So luot xem
    echo - rating_avg: Diem danh gia trung binh
    echo - rating_count: So luong danh gia
    echo.
    echo Bay gio ban co the:
    echo 1. Khoi dong lai server
    echo 2. Vao trang admin de them san pham moi
    echo 3. Kiem tra trang san pham nguoi dung
    echo.
) else (
    echo.
    echo ========================================
    echo    LOI CAP NHAT DATABASE!
    echo ========================================
    echo.
    echo Co loi xay ra khi cap nhat database.
    echo Hay kiem tra:
    echo 1. MySQL da duoc cai dat va chay
    echo 2. Duong dan MySQL trong file nay dung
    echo 3. Mat khau MySQL dung
    echo.
)

pause 