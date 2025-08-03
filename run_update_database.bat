@echo off
echo Updating database with new product fields...
mysql -u root -p webbanhngot < update_database.sql
echo Database updated successfully!
pause 