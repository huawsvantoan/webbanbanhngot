@echo off
echo Importing sample data to database...
mysql -u root -p webbanhngot < sample_data.sql
echo Sample data imported successfully!
pause 