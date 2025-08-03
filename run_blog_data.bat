@echo off
echo Importing blog sample data to database...
mysql -u root -p webbanhngot < blog_sample_data.sql
echo Blog sample data imported successfully!
pause 