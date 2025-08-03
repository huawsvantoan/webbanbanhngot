@echo off
echo Cap nhat database nhanh...
echo.

REM Thay doi duong dan MySQL theo may cua ban
set MYSQL_PATH="C:\xampp\mysql\bin\mysql.exe"

echo Chay script SQL...
%MYSQL_PATH% -u root -p < simple_fix.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    CAP NHAT THANH CONG!
    echo ========================================
    echo.
    echo Bay gio hay:
    echo 1. Khoi dong lai server
    echo 2. Vao http://localhost:3000/products
    echo.
) else (
    echo.
    echo ========================================
    echo    LOI!
    echo ========================================
    echo.
    echo Hay kiem tra:
    echo 1. MySQL da chay
    echo 2. Duong dan MySQL dung
    echo 3. Mat khau MySQL dung
    echo.
)

pause 