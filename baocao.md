Các yêu cầu của báo cáo đây ạ
LỜI MỞ ĐẦU	1
LỜI CẢM ƠN	2
NHẬN XÉT CỦA GIẢNG VIÊN	3
NHẬN XÉT CỦA HỘI ĐỒNG PHẢN BIỆN	6
MỤC LỤC HÌNH ẢNH	10
MỤC LỤC BẢNG BIỂU	13
GIỚI THIỆU ĐỀ TÀI	16
1.1.	Giới thiệu đề tài	16
1.2.	Lý do chọn đề tài.	16
1.3.	Phạm vi đề tài	17
1.4.	Giới thiệu nhóm.	17
1.5.	 Mô hình phát triển.	18
KHẢO SÁT YÊU CẦU THỰC TẾ	20
2.1.  Mô tả hiện trạng	20
2.2. Tình trạng hiện tại theo mô hình SWOT.	20
2.3.	Các website đối thủ cạnh tranh.	21
2.2.1.	Website “LÊ GIA INTERIOR DESIGN”	21
2.2.2.	Website “Nội thất xinh”	22
2.2.3.	Website “Moho”	23
PHÂN TÍCH YÊU CẦU	25
3.1.	Các yêu cầu cụ thể hệ thống:	25
3.1.1.	Về phía khách hàng:	25
3.1.2.	Về phía Quản trị viên(Administrator):	27
3.2.	Các yêu cầu phi chức năng hệ thống:	27
3.3.	Các yêu cầu về công nghệ:	28
3.3.1.	Phần frontend	28
3.3.2.	Phần Backend:	30
3.4.	Các yêu cầu về bảo mật	31
THIẾT KẾ HỆ THỐNG.	32
4.1.	Mô hình UseCase	32
4.1.1.	Sơ đồ UseCase tổng quát.	34
4.1.2.	Sơ đồ Use Case phân rã.	35
4.1.3.	Danh sách Usecase.	38
4.2.	Đặc tả chi tiết hệ thống.	42
4.2.1.	Đặc tả khách hàng	42
4.2.2.	Đặc tả admin	72
4.2.3.	Sơ đồ luồng dữ liệu	80
4.3.	Sơ đồ triển khai và yêu cầu hệ thống	83
4.3.1.	Sơ đồ triển khai	83
4.3.2.	Yêu cầu hệ thống	84
4.3.3.	Mô hình công nghệ ứng dụng	84
4.4.	Sơ đồ quan hệ thực thể (ERD)	85
4.5.	Sơ đồ tổ chức giao diện (site map)	86
4.6.	Phác thảo mockup	87
4.6.1.	Trang chủ	87
4.6.2.	Trang giới thiệu	88
4.6.3.	Trang sản phẩm	89
4.6.4.	Trang bộ sưu tập	90
4.6.5.	Trang thông tin tài khoản.	91
4.6.6.	Trang giỏ hàng	92
THỰC HIỆN DỰ ÁN	93
5.1.	Tạo CSDL với MySQL	93
5.1.	Mô hình MVC	93
5.2.	Công nghệ quản lý dự án	93
5.3.1.	Quản lý sources code bằng Github	93
5.3.2.	Quản lý tiến độ công việc bằng Trello	94
5.4.	Cấu trúc tổ chức code	94
KIỂM THỬ WEBSITE VÀ SỬA LỖI	96
5.3.	Xác định nhiệm vụ kiểm thử	96
5.3.1.	Đối với người dùng	96
5.3.2.	Đối với người quản trị	97
5.4.	Kiểm thử	99
KẾT QUẢ WEBSITE	138
7.1.	Giao diện trang client	138
7.2.	Giao diện trang admin	146
ĐÓNG GÓI VÀ TRIỂN KHAI	150
KẾT LUẬN	151
5.5.	Khó khăn	151
5.6.	Thuận lợi	151
5.7.	Hướng phát triển trong tương lai	151
TÀI LIỆU THAM KHẢO	152
BẢNG PHÂN CHIA CÔNG VIỆC	153



---- đây là mẫu báo cáo bạn có thể dựa vào đó nha

CAO ĐẲNG FPT POLYTECHNIC









BÁO CÁO DỰ ÁN TỐT NGHIỆP
CHUYÊN NGÀNH: LẬP TRÌNH WEB
 
XÂY DỰNG ỨNG DỤNG WEB
 BÁN BÁNH NGỌT

Giáo viên hướng dẫn:	Nguyễn Trần Nhật Kha
Nhóm :	…
Tên thành viên:	HỨA VĂN TOÀN– PD10466 (L)
NGUYỄN TIẾN ĐẠT– PD11202
VÕ HỮU VŨ–PD11130
LƯƠNG NGỌC QUANG–PD




Đà Nẵng, tháng 8 năm 2025
 
LỜI MỞ ĐẦU
      Trong thời đại công nghệ số phát triển mạnh mẽ, việc ứng dụng công nghệ thông tin vào các lĩnh vực đời sống đã trở thành xu hướng tất yếu. Đặc biệt, thương mại điện tử ngày càng đóng vai trò quan trọng trong hoạt động kinh doanh, giúp doanh nghiệp tiếp cận khách hàng nhanh chóng, mở rộng thị trường và nâng cao hiệu quả cạnh tranh.
      Nhận thấy tiềm năng của thị trường trực tuyến, nhóm chúng em đã thực hiện đề tài “Thiết kế và xây dựng website bán bánh ngọt”. Mục tiêu của đề tài là tạo ra một nền tảng bán hàng tiện lợi, hiện đại, giúp cửa hàng dễ dàng giới thiệu sản phẩm, quảng bá thương hiệu và hỗ trợ khách hàng mua sắm mọi lúc, mọi nơi.
      Thông qua dự án này, nhóm mong muốn áp dụng những kiến thức đã được học vào thực tiễn, đồng thời rèn luyện kỹ năng thiết kế web, quản lý dữ liệu và nâng cao khả năng phối hợp làm việc nhóm. Ngoài ra, đây cũng là cơ hội để chúng em tiếp cận gần hơn với các yêu cầu thực tế trong lĩnh vực công nghệ thông tin, chuẩn bị hành trang vững chắc cho công việc sau khi ra trường.
       Nhóm chúng em xin chân thành cảm ơn quý thầy cô đã tận tình hướng dẫn và đóng góp ý kiến để nhóm hoàn thành đề tài này.











LỜI CẢM ƠN
       Trước hết, nhóm chúng em xin gửi lời cảm ơn sâu sắc đến Ban Giám Hiệu trường Cao đẳng FPT Polytechnic Đà Nẵng cùng các thầy cô bộ môn đã tận tình giảng dạy, trang bị cho chúng em những kiến thức và kỹ năng quý báu trong suốt quá trình học tập tại trường. Đây chính là nền tảng quan trọng giúp chúng em tự tin hơn khi thực hiện đề tài tốt nghiệp và chuẩn bị bước vào môi trường làm việc thực tế.
      Nhóm cũng xin bày tỏ lòng biết ơn đặc biệt đến thầy Nguyễn Trần Nhật Kha, người đã đồng hành, hướng dẫn tận tình và đưa ra những ý kiến góp ý giá trị để nhóm hoàn thiện đề tài “Thiết kế và xây dựng website bán bánh ngọt”. Nhờ sự hỗ trợ và định hướng từ thầy, nhóm đã có thể phát triển sản phẩm đúng tiến độ, đảm bảo chất lượng như mong đợi.
Bên cạnh đó, nhóm cũng xin cảm ơn gia đình và bạn bè đã luôn động viên, khích lệ tinh thần, tạo điều kiện thuận lợi để chúng em hoàn thành dự án một cách tốt nhất.
      Mặc dù đã nỗ lực hết sức, nhưng do thời gian và kinh nghiệm thực tế còn hạn chế, bài báo cáo chắc chắn sẽ không tránh khỏi những thiếu sót. Chúng em rất mong nhận được những ý kiến đóng góp quý báu từ quý thầy cô và hội đồng để nhóm có thể hoàn thiện hơn trong tương lai.
Chúng em xin chân thành cảm ơn!
 
 
NHẬN XÉT CỦA GIẢNG VIÊN
 
 
  
NHẬN XÉT CỦA HỘI ĐỒNG PHẢN BIỆN
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
............................................................................................................................
HĐ phản biện ký, ghi rõ họ tên
 
Mục lục
LỜI MỞ ĐẦU	1
LỜI CẢM ƠN	2
NHẬN XÉT CỦA GIẢNG VIÊN	3
NHẬN XÉT CỦA HỘI ĐỒNG PHẢN BIỆN	6
MỤC LỤC HÌNH ẢNH	10
MỤC LỤC BẢNG BIỂU	13
GIỚI THIỆU ĐỀ TÀI	16
1.1.	Giới thiệu đề tài	16
1.2.	Lý do chọn đề tài.	16
1.3.	Phạm vi đề tài	17
1.4.	Giới thiệu nhóm.	17
1.5.	 Mô hình phát triển.	18
KHẢO SÁT YÊU CẦU THỰC TẾ	20
2.1.  Mô tả hiện trạng	20
2.2. Tình trạng hiện tại theo mô hình SWOT.	20
2.3.	Các website đối thủ cạnh tranh.	21
2.2.1.	Website “LÊ GIA INTERIOR DESIGN”	21
2.2.2.	Website “Nội thất xinh”	22
2.2.3.	Website “Moho”	23
PHÂN TÍCH YÊU CẦU	25
3.1.	Các yêu cầu cụ thể hệ thống:	25
3.1.1.	Về phía khách hàng:	25
3.1.2.	Về phía Quản trị viên(Administrator):	27
3.2.	Các yêu cầu phi chức năng hệ thống:	27
3.3.	Các yêu cầu về công nghệ:	28
3.3.1.	Phần frontend	28
3.3.2.	Phần Backend:	30
3.4.	Các yêu cầu về bảo mật	31
THIẾT KẾ HỆ THỐNG.	32
4.1.	Mô hình UseCase	32
4.1.1.	Sơ đồ UseCase tổng quát.	34
4.1.2.	Sơ đồ Use Case phân rã.	35
4.1.3.	Danh sách Usecase.	38
4.2.	Đặc tả chi tiết hệ thống.	42
4.2.1.	Đặc tả khách hàng	42
4.2.2.	Đặc tả admin	72
4.2.3.	Sơ đồ luồng dữ liệu	80
4.3.	Sơ đồ triển khai và yêu cầu hệ thống	83
4.3.1.	Sơ đồ triển khai	83
4.3.2.	Yêu cầu hệ thống	84
4.3.3.	Mô hình công nghệ ứng dụng	84
4.4.	Sơ đồ quan hệ thực thể (ERD)	85
4.5.	Sơ đồ tổ chức giao diện (site map)	86
4.6.	Phác thảo mockup	87
4.6.1.	Trang chủ	87
4.6.2.	Trang giới thiệu	88
4.6.3.	Trang sản phẩm	89
4.6.4.	Trang bộ sưu tập	90
4.6.5.	Trang thông tin tài khoản.	91
4.6.6.	Trang giỏ hàng	92
THỰC HIỆN DỰ ÁN	93
5.1.	Tạo CSDL với MySQL	93
5.1.	Mô hình MVC	93
5.2.	Công nghệ quản lý dự án	93
5.3.1.	Quản lý sources code bằng Github	93
5.3.2.	Quản lý tiến độ công việc bằng Trello	94
5.4.	Cấu trúc tổ chức code	94
KIỂM THỬ WEBSITE VÀ SỬA LỖI	96
5.3.	Xác định nhiệm vụ kiểm thử	96
5.3.1.	Đối với người dùng	96
5.3.2.	Đối với người quản trị	97
5.4.	Kiểm thử	99
KẾT QUẢ WEBSITE	138
7.1.	Giao diện trang client	138
7.2.	Giao diện trang admin	146
ĐÓNG GÓI VÀ TRIỂN KHAI	150
KẾT LUẬN	151
5.5.	Khó khăn	151
5.6.	Thuận lợi	151
5.7.	Hướng phát triển trong tương lai	151
TÀI LIỆU THAM KHẢO	152
BẢNG PHÂN CHIA CÔNG VIỆC	153

 
MỤC LỤC HÌNH ẢNH
Hình 1. Sơ đồ thác nước	18
Hình 2. Giao diện trang “Lê gia interior design”	22
Hình 3. Giao diện trang “Nội thất xinh”	23
Hình 4. Giao diện trang “Moho”	24
Hình 5. Logo HTML	29
Hình 6. Logo CSS	30
Hình 7. Logo JavaScript	31
Hình 8. Logo Bootstrap	31
Hình 9. Logo jQuery	32
Hình 10. Logo PHP	33
Hình 11. Logo Laravel	34
Hình 12. Logo MySQL	35
Hình 13. Sơ đồ Usecase tổng quát	39
Hình 14. Sở đồ Usecase phân rã – khách hàng	40
Hình 15. Sơ đồ Usecase phân rã – nhân viên	41
Hình 16. Sở đồ Usecase phân rã – Admin	42
Hình 17. Sơ đồ tuần tự đăng ký	49
Hình 18. Sơ đồ hoạt động đăng ký	49
Hình 19. Sơ đồ tuần tự đăng nhập	51
Hình 20. Sơ đồ hoạt động đăng nhập	51
Hình 21. Sơ đồ tuần tự quên mật khẩu	53
Hình 22. Sơ đồ hoạt động quên mật khẩu	53
Hình 23. Sơ đồ tuần tự đổi mật khẩu	55
Hình 24. Sơ đồ hoạt động đổi mật khẩu	55
Hình 25. Sơ đồ tuần tự quản lý thông tin tài khoản	56
Hình 26. Sơ đồ hoạt động quản lý thông tin tài khoản	57
Hình 28. Sơ đồ tuần tự tìm kiếm sản phẩm	59
Hình 29. Sơ đồ hoạt động tìm kiếm sản phẩm	60
Hình 30. Sơ đồ tuần tự lọc sản phẩm	61
Hình 31. Sơ đồ tuần tự lọc sản phẩm	61
Hình 32. Sơ đồ tuần tự xem sản phẩm	63
Hình 33. Sơ đồ hoạt động xem sản phẩm	63
Hình 34. Sơ đồ tuần tự mua sắm theo bộ sưu tập	65
Hình 35. Sơ đồ hoạt động mua sắm theo bộ sưu tập	65
Hình 36. Sơ đồ tuần tự thêm sản phẩm vào giỏ hàng	67
Hình 37. Sơ đồ hoạt động thêm sản phẩm vào giỏ hàng	67
Hình 38. Sơ đồ tuần tự quản lý giỏ hàng	69
Hình 39. Sơ đồ hoạt động quản lý giỏ hàng	69
Hình 40. Sơ đồ tuần tự thanh toán	71
Hình 41. Sơ đồ hoạt động thanh toán	72
Hình 42. Sơ đồ tuần tự tìm theo dõi đơn hàng	73
Hình 43. Sơ đồ hoạt động theo dõi đơn hàng	73
Hình 44. Sơ đồ tuần tự đánh giá sản phẩm	74
Hình 45. Sơ đồ hoạt động đánh giá sản phẩm	75
Hình 46. Sơ đồ tuần tự quản lý sản phẩm yêu thích	76
Hình 47. Sơ đồ hoạt động quản lý sản phẩm yêu thích	76
Hình 48. Sơ đồ tuần tự xem danh sách sản phẩm	77
Hình 49. Sơ đồ hoạt động xem danh sách sản phẩm	78
Hình 50. Sơ đồ tuần tự thêm sản phẩm	79
Hình 51. Sơ đồ hoạt động thêm sản phẩm	79
Hình 52. Sơ đồ tuần tự cập nhật sản phẩm	81
Hình 53. Sơ đồ hoạt động cập nhật sản phẩm	81
Hình 54. Sơ đồ tuần tự xoá sản phẩm	83
Hình 55. Sơ đồ hoạt động xoá sản phẩm	83
Hình 56. Sơ đồ tuần tự thống kê	84
Hình 57. Sơ đồ hoạt động thống kê	85
Hình 58. Sơ đồ luồng dữ liệu mức 0	85
Hình 59. Sơ đồ luồng dữ liệu đăng ký mức 2	86
Hình 60. Sơ đồ luồng dưc liệu đăng nhập mức 2	86
Hình 61. Sơ đồ luồng dữ luêuj đổi mật khẩu mức 2	86
Hình 62. Sơ đồ luồng dữ liệu xem chi tiết sản phẩm mức 2	87
Hình 63. Sơ đồ luồng dữ liệu thêm vào giỏ hàng mức 2	87
Hình 64. Sơ đồ luồng dữ liệu thanh toán mức 2	87
Hình 65. Sơ đồ luồng dữ liệu quản lý sản phẩm mức 2	88
Hình 65. Sơ đồ triển khai	88
Hình 67. Mô hình client – server	89
Hình 67. Mô hình client – server	89
Hình 69. Sơ đồ thực thể ERD	90
Hình 71. Sơ đồ sitemap khách hàng	91
Hình 72. Sơ đồ sitemap quản lý	91
Hình 73. Mockup trang chủ	92
Hình 74. Mockup trang giới thiệu	93
Hình 75. Mockup trang sản phẩm	94
Hình 76. Mockup trang bộ sưu tập	95
Hình 77. Mockup trang thông tin tài khoản	96
Hình 78. Mockup trang giỏ hàng	97
Hình 79. Sơ đồ cơ sở dữ liệu	98
Hình 80. Quản lý code trên github	117
Hình 81. Quản lý code trên github	117
Hình 82. Quản lý dự án tiến độ ở trello	118
Hình 83, Mô tả cấu trúc thư mục	118
Hình 84. Giao diện trang chủ (1)	174
Hình 85. Giao diện trang chủ (2)	175
Hình 86. Giao diện trang chủ (3)	175
Hình 87. Giao diện trang sản phẩm	176
Hình 88. Giao diện trang chi tiết sản phẩm	177
Hình 89. Giao diện trang đăng ký	178
Hình 90. Giao diện trang đăng nhập	178
Hình 91. Giao diện trang quên mật khẩu	179
Hình 92. Giao diện tràn cập nhật thông tin	180
Hình 93. Giao diện trang đổi mật khẩu	181
Hình 94. Giao diện trang quản lý danh mục	182
Hình 95. Giao diện quản lý sản phẩm	182
Hình 96. Giao diện trang quản lý thành viên	183
Hình 97. Giao diện trang quản lý phân quyền	184
Hình 98. Giao diện trang quản lý bộ sưu tập	184
Hình 99. Giao diện thống kê	185
 
MỤC LỤC BẢNG BIỂU
Bảng 1. Tình trạng hiện tại	22
Bảng 2. Yêu cầu phi chức năng	29
Bảng 3. Danh sách các Artor và chức năng chính	38
Bảng 4. Danh sách Usecase	47
Bảng 5. Mô tả Usecase đăng ký	48
Bảng 6. Mô tả Usecase đăng nhập	50
Bảng 7. Mô tả Usecase quên mật khẩu	52
Bảng 8. Mô tả Usecase đổi mật khẩu	54
Bảng 9. Mô tả Usecase quản lý thông tin cá nhân	56
Bảng 10. Mô tả Usecase quản lý tìm kiếm sản phẩm	59
Bảng 11. Mô tả Usecase lọc sản phẩm	60
Bảng 12. Mô tả Usecase xem sản phẩm	62
Bảng 13. Mô tả Usecase mua săm theo bộ sưu tập	64
Bảng 14. Mô tả Usecase thêm sản phẩm vào giỏ hàng	66
Bảng 15. Mô tả UseCase quản lý giỏi hàng	68
Bảng 16. Mô tả Usecase thanh toán	70
Bảng 17. Mô tả Usecase đánh giá sản phẩm	74
Bảng 18. Mô tả Usecase quản lý sản phẩm yêu thích	76
Bảng 19. Mô tả UseCase xem danh sách sản phẩm	77
Bảng 20. Mô tả Usecase thêm sản phẩm	79
Bảng 21. Bảng mô tả Usecase cập nhật sản phẩm	80
Bảng 22. Mô tả Usecase xoá sản phẩm	82
Bảng 23.Mô tả UseCase thống kê	84
Bảng 24. Thành phần mô hình client – server	89
Bảng 25. Thành phần mô hình local	90
Bảng 26. Cấu trúc bảng	98
Bảng 27. Cấu trúc bảng attribute_category	99
Bảng 28. Cấu trúc bảng cart	100
Bảng 29. Cấu trúc bảng categories	100
Bảng 30. Cấu trúc bảng collections	101
Bảng 31. Cấu trúc bảng comments	102
Bảng 32. Cấu trúc bảng discount_code	103
Bảng 33. Cấu trúc bảng districts	104
Bảng 34. Cấu trúc bảng forbidden_words	105
Bảng 35. Cấu trúc bảng orders	106
Bảng 36. Cấu trúc bảng order_details	108
Bảng 37. Cấu trúc bảng order_payments	109
Bảng 38. Cấu trúc bảng permissions	109
Bảng 39. Cấu trúc bảng products	111
Bảng 40. Cấu trúc bảng provinces	112
Bảng 41. Cấu trúc bảng reviews	112
Bảng 42. Cấu trúc bảng roles	113
Bảng 43. Cấu trúc bảng users	114
Bảng 44. Cấu trúc bảng wards	115
Bảng 45. Cấu trúc bảng wishlists	115
Bảng 46. Thành phần danh mục controller - admin	121
Bảng 47. Thành phần sản phẩm controller	121
Bảng 48. Thành phần thuộc tính controller - admin	122
Bảng 49. Thành phần Auth controller -admin	122
Bảng 50. Thành phần bộ sưu tập controller - admin	123
Bảng 51. Thành phần bình luận controller - admin	124
Bảng 52. Thành phần nội dung cấm controller - admin	124
Bảng 53. Thành phần dashboard controller - admin	124
Bảng 54. Thành phần mã giảm giá controller - admin	125
Bảng 55. Thành phần đơn hàng controller - admin	126
Bảng 56. Thành phần phân quyền controller - admin	126
Bảng 57. Thành phần đánh giá controller - admin	127
Bảng 58. Thành phần vai trò controller	127
Bảng 59. Thành phần người dùng controller - admin	128
Bảng 60. Thành phần sản phẩm yêu thích controller - admin	128
Bảng 61. Thành phần tài khoản controller - client	129
Bảng 62. Thành phần auth controller	129
Bảng 63. Thành phần giỏ hàng controller	130
Bảng 64. Thành phần danh mục controller	130
Bảng 65. Thành phần bọ sưu tập controller	131
Bảng 66. Thành phần bình luận controller	131
Bảng 67. Thành phần trang chủ trong controller	131
Bảng 68. Thành phần sản phẩn controller	131
Bảng 69. Tổng quát chức năng kiểm thử	135
Bảng 70. Testcase form đăng ký	136
Bảng 71. Testcase đăng nhập	137
Bảng 72. Testcase form quên mật khẩu	138
Bảng 73. Test case form cập nhật thông tin	140
Bảng 74. Test case form thêm mới tài khoản	142
Bảng 75. Testcase form cặp nhật tài khoản	144
Bảng 76. Testcase form thêm mới danh mục	145
Bảng 77. Testcase form cập nhật danh mục	147
Bảng 78. Testcase form thêm mới sản phẩm	148
Bảng 79. Testcase form cập nhật sản phẩm	149
Bảng 80. Testcase form thêm mới thuộc tính	150
Bảng 81. Testcase form cập nhật thuộc tính	151
Bảng 82. Testcase form mới vai trò	152
Bảng 83. Testcase form cập nhật vai trò	153
Bảng 84. Testcase form thêm mới bộ sưu tập	154
Bảng 85. Testcase form cập nhật bộ sưu tập	155
Bảng 86 . Testcase form thêm mới đơn hàng	159
Bảng 87 . Testcase form cập nhật đơn hàng	165
Bảng 88 . Testcase form thêm mới mã giảm giá	169
Bảng 89 . Testcase form cập nhật mã giảm giá	173
Bảng 90. Mô tả điều khiển trang chính	176
Bảng 91. Mô tả điều khiển trang sản phẩm	177
Bảng 92. Bảng mô tả điều khiển chi tiết sản phẩm	178
Bảng 93. Mo tả điều khiển đăng ký	178
Bảng 94. Mô tả điều khiển đăng nhập	179
Bảng 95. Mô tả điều khiển trang quên mật khẩu	179
Bảng 96. Bảng mô tả điều khiển trang cập nhật thông tin	180
Bảng 97. Mô tả điều khiển trang dổi mật khẩu	181
Bảng 98. Mô tả điều khiển quản lý danh mục	182
Bảng 99. Mô tả điều khiển quản lý hàng hoá	183
Bảng 100. Mô tả điề khiển quản lý thành viên	183
Bảng 101. Mô tả điều khiển quản lý phân quyền	184
Bảng 102. Mô tả điều khiển quản lý bộ sưu tập	185
Bảng 103. Mô tả điều khiển thống kê	185
Bảng 104. Đóng gói và triển kahi	186

 
GIỚI THIỆU ĐỀ TÀI 
1.1.	Giới thiệu đề tài
Trong thời đại công nghệ thông tin phát triển mạnh mẽ, việc ứng dụng công nghệ vào các lĩnh vực của đời sống ngày càng trở nên phổ biến, đặc biệt là trong lĩnh vực thương mại điện tử. Sự gia tăng nhanh chóng của Internet và các thiết bị di động đã thay đổi cách thức con người mua sắm, khi các giao dịch trực tuyến trở nên tiện lợi và được ưa chuộng hơn bao giờ hết.
Nắm bắt xu hướng đó, nhóm chúng em lựa chọn đề tài: “Xây dựng website bán bánh ngọt” nhằm mang đến một giải pháp trực tuyến hiện đại, hỗ trợ cửa hàng bánh ngọt quảng bá sản phẩm, tiếp cận khách hàng dễ dàng hơn và nâng cao hiệu quả kinh doanh. Website không chỉ giúp khách hàng tìm kiếm và lựa chọn sản phẩm nhanh chóng mà còn mang đến trải nghiệm mua sắm tiện lợi chỉ với vài thao tác trên điện thoại hoặc máy tính.
Trong quá trình thực hiện, nhóm tập trung xây dựng một website thương mại điện tử có giao diện thân thiện, dễ sử dụng, cùng các chức năng hỗ trợ quản lý sản phẩm, đơn hàng và khách hàng. Mục tiêu là mang đến cho người dùng một nền tảng mua sắm trực tuyến tiện lợi, an toàn và hiệu quả.
1.2.	Lý do chọn đề tài.
Với sự phát triển của công nghệ và thói quen mua sắm ngày càng chuyển dịch sang trực tuyến, việc sở hữu một website bán hàng là yếu tố quan trọng giúp doanh nghiệp cạnh tranh và mở rộng thị trường. Đặc biệt trong lĩnh vực bánh ngọt, khách hàng hiện nay có xu hướng tìm kiếm sản phẩm, đặt hàng và thanh toán online để tiết kiệm thời gian và thuận tiện hơn.
     Việc xây dựng một website bán bánh ngọt sẽ giúp cửa hàng:
•	Quảng bá thương hiệu đến nhiều khách hàng tiềm năng hơn.
•	Hỗ trợ hoạt động kinh doanh 24/7, không bị giới hạn bởi thời gian hay không gian.
•	Đơn giản hóa quy trình đặt hàng, thanh toán và chăm sóc khách hàng.
Với mong muốn áp dụng những kiến thức đã học vào thực tiễn và rèn luyện kỹ năng lập trình web, nhóm chúng em đã lựa chọn đề tài này để xây dựng một hệ thống thương mại điện tử hoàn chỉnh, hiện đại và phù hợp với xu hướng phát triển của xã hội.
1.3.	Phạm vi đề tài
•	Mục tiêu chính: Xây dựng một nền tảng trực tuyến giúp khách hàng dễ dàng tìm kiếm, lựa chọn và mua sắm các sản phẩm bánh ngọt một cách nhanh chóng, thuận tiện.
•	Phạm vi chức năng:
Giao diện người dùng (frontend)
o	Trang chủ: Hiển thị sản phẩm nổi bật, và danh mục sản phẩm.
o	Trang danh mục: Phân loại sản phẩm theo loại bánh (bánh kem, bánh mì, bánh quy, bánh sinh nhật…).
o	Trang chi tiết sản phẩm: Thông tin chi tiết về bánh, hình ảnh, giá bán, đánh giá từ khách hàng.
o	Giỏ hàng và thanh toán: Cho phép thêm sản phẩm vào giỏ, tính tổng giá, và chọn phương thức thanh toán.
o	Tìm kiếm và lọc sản phẩm: Theo tên bánh, mức giá, hoặc loại bánh.
o	Giao diện hệ thống (backend)
o	Quản lý sản phẩm: Thêm, sửa, xóa sản phẩm, quản lý số lượng tồn kho.
o	Quản lý đơn hàng: Theo dõi và xử lý các đơn đặt hàng từ khách.
o	Quản lý khách hàng: Lưu trữ thông tin khách hàng và lịch sử mua hàng.
•	Phạm vi công nghệ
o	Ngôn ngữ lập trình: NodeJS, JavaScript, ReactJS
o	Cơ sở dữ liệu: MySQL.
o	Giao diện: Sử dụng HTML, CSS, Bootstrap/Tailwind CSS
o	Tích hợp: Cổng thanh toán (PayPal). gửi email xác nhận đăng ký.
•	Phạm vi kinh doanh
o	Đối tượng khách hàng Người tiêu dùng có nhu cầu mua bánh ngọt (cá nhân, gia đình, công ty đặt tiệc, trường học…).
•	Sản phẩm kinh doanh: Bánh sinh nhật, bánh kem tươi, bánh mì, bánh quy, bánh theo mùa lễ (Trung thu, Giáng sinh), và các loại đồ uống kèm theo.
•	Phạm vi triển khai
o	Hệ thống trực tuyến: Website tương thích với cả máy tính và thiết bị di động (responsive design)
o	Tích hợp SEO: Tối ưu tìm kiếm trên Google để thu hút khách hàng tiềm năng.
o	Hỗ trợ khách hàng: Chat trực tuyến, thông tin liên hệ, chính sách đổi trả.
1.4.	Giới thiệu nhóm.
Nhóm gồm 4 thành viên: 
o	Hứa Văn Toàn (Nhóm trưởng)
o	Nguyễn Tiến Đạt
o	Võ Hữu Vũ
o	Lương Ngọc Quang

1.5.	 Mô hình phát triển.
Mô hình thác nước (Waterfall) được giới thiệu lần đầu tiên bởi Winston Royce vào năm 1970. Dù hiện nay các phương pháp linh hoạt như Agile ngày càng phổ biến, mô hình thác nước vẫn được nhiều dự án lựa chọn nhờ tính tuần tự và rõ ràng trong từng giai đoạn phát triển.Trong dự án xây dựng website bán bánh ngọt, nhóm chúng em đã lựa chọn áp dụng mô hình thác nước vì nó phù hợp với yêu cầu và nguồn lực hiện tại của nhóm.
Giới thiệu về mô hình thác nước:
Mô hình thác nước là phương pháp phát triển phần mềm theo trình tự tuyến tính, trong đó mỗi giai đoạn phải được hoàn thành trước khi bước sang giai đoạn tiếp theo. Quy trình này giúp đảm bảo tính logic, giảm thiểu sai sót và hỗ trợ nhóm dễ dàng kiểm soát tiến độ dự án.
Các bước của mô hình bao gồm:
1.	Phân tích yêu cầu (Requirement Analysis): Thu thập và xác định các yêu cầu chức năng của website như quản lý sản phẩm bánh ngọt, giỏ hàng, đặt hàng và thanh toán.
2.	Thiết kế hệ thống (System Design): Xây dựng cấu trúc cơ sở dữ liệu, giao diện người dùng, sơ đồ chức năng và luồng xử lý.
3.	Triển khai (Implementation): Tiến hành lập trình website, từ front-end (HTML, CSS, JavaScript) đến back-end (PHP, MySQL).
4.	Kiểm thử (Testing): Đánh giá toàn bộ hệ thống để phát hiện lỗi và tối ưu hiệu năng.
5.	Bảo trì (Maintenance): Sau khi triển khai, thực hiện chỉnh sửa, cập nhật và bổ sung chức năng khi cần thiết.

Lý do lựa chọn mô hình thác nước cho dự án
•	Yêu cầu rõ ràng và ít thay đổi: Các chức năng chính của website như quản lý sản phẩm, đặt hàng, xử lý đơn hàng... đã được nhóm xác định ngay từ đầu. Điều này phù hợp với quy trình phát triển tuần tự của mô hình.
•	Quy trình phát triển có cấu trúc: Mô hình giúp nhóm chia công việc thành từng giai đoạn rõ ràng, thuận tiện để theo dõi tiến độ và phối hợp giữa các thành viên.
•	Tối ưu thời gian và tài nguyên: Với quy mô dự án nhỏ, mô hình này giúp nhóm tận dụng tốt nguồn lực và hạn chế rủi ro phát sinh trong quá trình làm việc.
•	Kiểm thử tổng thể trước khi triển khai: Cho phép kiểm tra toàn diện hệ thống trước khi đưa website vào sử dụng, đảm bảo đáp ứng yêu cầu của khách hàng.
 
KHẢO SÁT YÊU CẦU THỰC TẾ
2.1.  Mô tả hiện trạng
Website bán bánh ngọt giúp cửa hàng tiếp cận khách hàng nhanh chóng và hiệu quả hơn trong thời đại số hóa. Người dùng có thể dễ dàng tìm kiếm và đặt mua các loại bánh, kẹo và đồ uống với hình ảnh rõ nét, thông tin chi tiết và giá cả minh bạch.
Ngoài ra, website hỗ trợ khách hàng để lại đánh giá, phản hồi sản phẩm và cập nhật các chương trình khuyến mãi qua banner, góp phần tăng tương tác và doanh số. Hệ thống còn giúp cửa hàng quản lý đơn hàng, sản phẩm và tối ưu chiến dịch marketing, tiết kiệm thời gian và chi phí vận hành.
2.2. Tình trạng hiện tại theo mô hình SWOT.
Điểm mạnh	Điểm yếu
Thành viên nắm vững các công nghệ hiện đại: NodeJS, ReactJS, MySQL, HTML, CSS…
Có khả năng tự học, tra cứu tài liệu tốt từ nhiều nguồn.
Nhóm phối hợp tốt, hỗ trợ nhau trong quá trình làm việc.	Một số thành viên ít kinh nghiệm thực tế trong triển khai website thương mại điện tử.
Lịch học và thực tập chồng chéo khiến việc họp nhóm và triển khai chậm tiến độ.
Thiếu kinh nghiệm về quản lý, vận hành hệ thống khi website hoạt động chính thức.
Cơ hội	Thách thức
Công nghệ hiện đại giúp xây dựng website nhanh chóng và tối ưu hiệu năng.
Được giảng viên hướng dẫn và hỗ trợ về kỹ thuật.
Nhu cầu mua bánh online tăng mạnh, đặc biệt các dịp lễ tết, sinh nhật.
Nhiều công cụ hỗ trợ miễn phí giúp nhóm dễ dàng thiết kế và quản lý.	Yêu cầu cao về SEO để tiếp cận người dùng và nâng cao thứ hạng tìm kiếm.
Hệ thống cần bảo mật cao để tránh nguy cơ bị tấn công và khai thác dữ liệu.
Cạnh tranh gay gắt với các thương hiệu lớn đã có lượng khách hàng trung thành.
Phải cập nhật công nghệ liên tục để bắt kịp xu hướng thị trường.
Bảng 1. Tình trạng hiện tại
2.3.	Các website đối thủ cạnh tranh.
2.2.1.	Website “Anh Hòa Bakery”
 
Hình 2. Giao diện trang “Lê gia interior design”
	Điểm mạnh:
Bố cục rõ ràng, dễ điều hướng:
Giao diện website trực quan, menu được phân loại khoa học giúp người dùng nhanh chóng tìm kiếm sản phẩm như bánh sinh nhật, bánh mì, bánh cookies…
Hình ảnh sản phẩm sắc nét
Các hình ảnh có chất lượng cao, được trình bày đẹp mắt, hấp dẫn thị giác người mua.
Thông tin sản phẩm đầy đủ
Mỗi sản phẩm đều có mô tả chi tiết về thành phần, trọng lượng, giá cả và hướng dẫn bảo quản, tạo niềm tin cho khách hàng.
Tích hợp đặt hàng online tiện lợi
Cho phép người dùng đặt bánh trực tiếp trên website, hỗ trợ nhiều phương thức liên hệ nhanh chóng (hotline, chat trực tuyến).
	Điểm yếu:
Thiết kế chưa hiện đại
Dù bố cục rõ ràng nhưng giao diện còn khá đơn giản, chưa có nhiều hiệu ứng nổi bật để thu hút người dùng trẻ.
Thiếu tính năng cá nhân hóa
Website chưa có chức năng lưu sản phẩm yêu thích hay gợi ý sản phẩm dựa trên hành vi người dùng.
Không có hệ thống đánh giá sản phẩm
Khách hàng không thể để lại nhận xét hay đánh giá, làm giảm khả năng xây dựng uy tín từ cộng đồng.
Chưa tối ưu cho thiết bị di động
Một số phần hiển thị trên smartphone chưa thực sự mượt mà, gây bất tiện cho người dùng.
2.2.2.	Website “Anh Quân Bakery”
 
Hình 3. Giao diện trang “Nội thất xinh”
	Điểm mạnh
Bố cục trực quan, dễ sử dụng
Giao diện website được thiết kế rõ ràng, các danh mục sản phẩm như bánh kem, bánh mì, bánh cookies được phân loại hợp lý, giúp người dùng dễ dàng tìm kiếm và điều hướng.
Hình ảnh sản phẩm bắt mắt
Sử dụng ảnh chụp thực tế sắc nét và hấp dẫn, thể hiện đầy đủ góc nhìn của sản phẩm, tạo sự tin tưởng và kích thích nhu cầu mua hàng.
Thông tin sản phẩm đầy đủ
Website cung cấp mô tả chi tiết, giá cả, nguyên liệu, trọng lượng, và các thông tin bảo quản, giúp khách hàng hiểu rõ về sản phẩm.
Chính sách ưu đãi đa dạng
Các chương trình giảm giá, combo bánh hoặc quà tặng đi kèm được giới thiệu nổi bật trên website, thu hút người mua.
	Điểm yếu
Thiết kế chưa hiện đại
Mặc dù dễ sử dụng, giao diện tổng thể khá đơn giản, ít hiệu ứng bắt mắt, chưa thực sự nổi bật so với các đối thủ khác.
Thiếu tính năng nổi bật
Website chưa hỗ trợ lưu sản phẩm yêu thích hoặc so sánh sản phẩm, gây bất tiện cho khách hàng khi muốn lựa chọn nhiều loại bánh.
Hạn chế trong cá nhân hóa
Người dùng không được gợi ý sản phẩm theo sở thích hoặc lịch sử mua hàng, dẫn đến trải nghiệm chưa thực sự tối ưu.
Tốc độ tải trang chậm
Một số hình ảnh có dung lượng lớn làm website tải lâu, đặc biệt khi truy cập bằng thiết bị di động.
Kết luận:Để xây dựng một website bán bánh ngọt hiệu quả, cần chú trọng tối ưu trải nghiệm người dùng thông qua thiết kế giao diện hiện đại, thân thiện và dễ sử dụng trên mọi thiết bị, đặc biệt là di động. Bổ sung các tính năng hấp dẫn như lưu sản phẩm yêu thích, đánh giá và gợi ý sản phẩm theo hành vi mua sắm sẽ giúp cá nhân hóa trải nghiệm và tăng tỷ lệ quay lại. Ngoài ra, nâng cao tốc độ tải trang và chất lượng hình ảnh sẽ cải thiện khả năng giữ chân người dùng. Đầu tư vào các chiến dịch marketing online, nội dung hấp dẫn (hình ảnh, mô tả chi tiết, bài viết gợi ý) cùng với dịch vụ khách hàng tốt (giao hàng nhanh, hỗ trợ tận tâm) sẽ là yếu tố then chốt để tạo lợi thế cạnh tranh và thu hút khách hàng trong lĩnh vực bánh ngọt handmade.
 
PHÂN TÍCH YÊU CẦU
3.1.	Các yêu cầu cụ thể hệ thống:
3.1.1.	Về phía khách hàng:
Yêu cầu từ khách hàng:
•	Đăng ký tài khoản: Người dùng có thể đăng ký để sử dụng các chức năng nâng cao như thêm sản phẩm vào giỏ hàng, theo dõi đơn hàng, và đánh giá sản phẩm.
•	Đăng nhập/Đăng xuất: Sau khi đăng ký, người dùng có thể đăng nhập để mua hàng và quản lý thông tin cá nhân, đồng thời có thể đăng xuất khi không sử dụng.
•	Quên mật khẩu: Người dùng có thể khôi phục mật khẩu qua email khi cần thiết.
•	Chức năng không cần đăng nhập:
•	Xem danh sách sản phẩm: Trang chủ hiển thị danh sách các loại bánh ngọt handmade như bánh kem, bánh cookies, bánh mì… kèm theo các sản phẩm nổi bật .
•	Tìm kiếm và lọc sản phẩm: Hỗ trợ tìm kiếm nhanh và lọc theo danh mục, giá cả, hoặc hương vị bánh.
•	Xem chi tiết sản phẩm: Hiển thị thông tin về giá, thành phần, trọng lượng, hình ảnh và các đánh giá từ khách hàng.
•	Chức năng cần đăng nhập:
•	Thêm sản phẩm vào giỏ hàng: Cho phép người dùng lưu trữ các sản phẩm muốn mua.
•	Quản lý giỏ hàng: Cập nhật số lượng, xóa sản phẩm, hoặc đặt hàng trực tiếp từ giỏ hàng.
•	Thanh toán: Hỗ trợ nhiều phương thức thanh toán (COD, chuyển khoản).
•	Xem và theo dõi đơn hàng: Người dùng có thể kiểm tra trạng thái đơn hàng và lịch sử mua hàng.
•	Đánh giá sản phẩm: Sau khi nhận hàng, người dùng có thể để lại đánh giá, bình luận về sản phẩm.
•	Liên hệ: Hỗ trợ người dùng gửi yêu cầu, thắc mắc hoặc phản hồi qua form liên hệ.
Từ những yêu cầu trên xây dựng các website có các yêu cầu: 
Các trang khách hàng cơ bản: 
Trang chủ:
Hiển thị danh sách các sản phẩm nổi bật như bánh sinh nhật, bánh mì, bánh cookies, các sản phẩm bán chạy, và các chương trình khuyến mãi (giảm giá theo phần trăm). Kèm theo slider/banners quảng cáo về cửa hàng hoặc các dịp lễ đặc biệt (Giáng sinh, Valentine, Tết…).
Trang danh mục sản phẩm:
Khi người dùng chọn một danh mục (ví dụ: Bánh sinh nhật, Bánh mì, Cookies), hệ thống hiển thị tất cả sản phẩm trong danh mục đó. Có các chức năng lọc và tìm kiếm nâng cao theo loại bánh, khoảng giá, hương vị, kích thước, v.v.
Trang chi tiết sản phẩm:
Hiển thị thông tin chi tiết của sản phẩm đã chọn, bao gồm:
Hình ảnh chất lượng cao, góc chụp đa dạng.
Thành phần, trọng lượng, ngày sản xuất & hạn sử dụng.
Đánh giá và nhận xét từ khách hàng đã mua.
Trang giỏ hàng:
Cho phép người dùng xem các sản phẩm đã thêm vào giỏ, cập nhật số lượng, xóa sản phẩm và hiển thị tổng tiền thanh toán.
Trang yêu thích:
Hiển thị các sản phẩm mà người dùng đã đánh dấu yêu thích để thuận tiện đặt hàng lần sau.
Trang bộ sưu tập:
Hiển thị các combo sản phẩm hoặc set bánh thiết kế theo chủ đề (ví dụ: “Combo bánh Giáng sinh”, “Set bánh Valentine”), giúp người dùng mua theo bộ với giá ưu đãi hơn.
Trang quản lý tài khoản:
Đăng ký, đăng nhập, đăng xuất tài khoản.
Quên mật khẩu, đổi mật khẩu, cập nhật thông tin cá nhân.
Theo dõi lịch sử đơn hàng và trạng thái giao hàng.
Trang thanh toán:
Hiển thị form nhập thông tin giao hàng (tên, số điện thoại, địa chỉ, ghi chú).
Chọn phương thức thanh toán:
• Thanh toán khi nhận hàng (COD).
• Thanh toán trực tuyến qua VNPay.
3.1.2.	Về phía Quản trị viên(Administrator):
Yêu cầu từ quản trị viên:
	Nhân viên: Để quản lý các thông tin như sản phẩm, đơn hàng, danh mục, bộ sưu tập và khách hàng, nhân viên cần phải đăng nhập vào hệ thống. Sau khi đăng nhập, nhân viên có thể chọn mục quản lý cần thiết, ví dụ như quản lý sản phẩm:
o	Trong phần quản lý sản phẩm, nhân viên có thể thực hiện các thao tác như xem, thêm, chỉnh sửa, hoặc xóa sản phẩm. 
o	Mọi thao tác quản lý đều yêu cầu quyền hạn tương ứng; nếu nhân viên không có đủ quyền, họ sẽ không thể thực hiện thao tác đó.
	Chủ trang web: Người sẽ có toàn bộ quyền, chức năng để điều hành trang web.
Từ các yêu cầu trên, wensite xây dựng phải có các yêu cầu sau: 
•	Các trang này cần có các chức năng chung như hiển thị, thêm, sửa, xóa, tìm kiếm, phân trang một cách hợp lý,…
o	Quản lý người dùng
o	Quản lý sản phẩm
o	Quản lý danh mục
o	Quản lý đánh giá, bình luận
o	Quản lý đơn hàng
o	Quản lý mã giảm giá
o	Quản lý phân quyền
•	Thống kê
•	Chỉnh sửa hệ thống trang web
3.2.	Các yêu cầu phi chức năng hệ thống:
STT	Tên yêu cầu	Mô tả yêu cầu
1	Giao diện	Giao diện hệ thống phải dễ sử dụng, trực quan, thân thiện với người dùng.
2	Tốc độ xử lý	Hệ thống phải xử lý nhanh chóng và chính xác.
Dung lượng website vừa phải, tốc độ truy xuất nhanh.
3	Bảo mật	Tính bảo mật và độ an toàn cao.
4	Tương thích	Tương thích với đa phần các trình duyệt web hiện tại.
Bảng 2. Yêu cầu phi chức năng
3.3.	Các yêu cầu về công nghệ:
3.3.1.	Phần frontend
	HTML

	CSS
	JavaScript

	Bootstrap

	jQuery
 

Hình 9. Logo jQuery
3.3.2.	Phần Backend:
	PHP

	Laravel

Hình 11. Logo Laravel

	MySQL
 
Hình 12. Logo MySQL

3.4.	Các yêu cầu về bảo mật
•	Tất cả các form nhập phải được kiểm soát dữ liệu (kiểm tra tính hợp lệ đầu  vào) một cách hợp lý.
•	Khách hàng chưa đăng nhập hoặc chưa mua sản phẩm không được phép gửi  bình luận về hàng hóa cũng như đổi mật khẩu, cập nhật thông tin tài khoản.
•	Chỉ có các nhân viên quản trị mới được phép thực hiện các chức năng quản  trị.
•	Bảo mật tài khoản người dùng, quản trị thông qua việc mã hóa mật khẩu.
 
THIẾT KẾ HỆ THỐNG.
4.1.	Mô hình UseCase
Danh sách các Actor.
Actor	Chức Năng
Khách vãng lai	•	Đăng ký
•	Xem danh sách sản phẩm
•	Xem thông tin chi tiết sản phẩm    
•	Tìm kiếm sản phẩm
•	Xem danh sách bộ sưu tập
•	Xem thông tin chi tiết bộ sưu tập
Khách hàng 
thành viên	Có các chức năng như Khách vãng lai và còn có  thêm một số chức năng khác như:
•	Thêm sản phẩm vào giỏ hàng 
•	Đặt Mua
•	Thanh toán
•	Hủy đơn
•	Đánh giá sản phẩm
•	Xem danh sách đơn hàng   quản lý đơn hàng
•	Đăng nhập
•	Quên mật khẩu
•	Quản lý thông tin cá nhân
•	Bình luận bộ sưu tập
•	Thêm sản phẩm vào danh sách yêu thích
Nhân Viên	Có tất cả chức năng của khách hàng thành viên và thêm một số chức năng khác và yêu cầu đăng nhập mới được   sử dụng:
•	Xem danh sách đơn hàng    cập nhật đơn hàng
•	Cập nhật sản phẩm
•	Cập nhật đơn giá
•	Các chức năng còn tùy thuộc vào quyền của nhân viên.     Mỗi người có một vai trò nhất định (mỗi nhân viên kiểm soát 1 CRUD khác nhau)
Quản trị viên	Có tất cả chức năng của khách hàng thành viên và thêm một số chức năng khác và yêu cầu đăng nhập mới được  sử dụng:
•	Quản lý phân quyền
•	Quản lý thành viên (Nhân viên, khách hàng)
•	Quản lý danh mục
•	Quản lý bộ sưu tập
•	Quản lý sản phẩm
•	Quản lý đơn hàng
•	Quản lý bình luận
•	Quản lý mã giảm giá
•	Quản lý thống kê
Bảng 3. Danh sách các Artor và chức năng chính
 
4.1.1.	Sơ đồ UseCase tổng quát.
 
Hình 13. Sơ đồ Usecase tổng quát
 
4.1.2.	Sơ đồ Use Case phân rã.
•	Khách hàng:
 
Hình 14. Sở đồ Usecase phân rã – khách hàng
 
•	Nhân viên:
 
Hình 15. Sơ đồ Usecase phân rã – nhân viên
 
•	Quản trị viên
 
Hình 16. Sở đồ Usecase phân rã – Admin

4.1.3.	Danh sách Usecase.
UC	Tên Usecase	Actor Sử Dụng
UC-01
Đăng ký	Khách hàng
UC-02
Đăng nhập	Khách hàng, nhân viên, quản trị viên
UC-03
Quên mật khẩu 	Khách hàng, nhân viên, quản trị viên
UC-04
Đổi mật khẩu	Khách hàng, nhân viên, quản trị viên
UC-05
Quản lý thông tin cá nhân	Khách hàng, nhân viên, quản trị viên
UC-06
Đăng xuất	Khách hàng, nhân viên, quản trị viên
UC-07
 Tìm kiếm sản phẩm	Khách hàng, nhân viên, quản trị viên
UC-08
Lọc sản phẩm theo danh mục (giá, màu sắc, chất liệu)	Khách hàng, nhân viên, quản trị viên
UC-09
Xem danh sách sản phẩm(công khai)	Khách hàng, nhân viên, quản trị viên
UC-10
 Xem danh sách sản phẩm đang khuyến mãi	Khách hàng, nhân viên, quản trị viên
UC-11
Xem thông tin chi tiết sản phẩm	Khách hàng, nhân viên, quản trị viên
UC-12
Xem đánh giá sản phẩm	Khách hàng, nhân viên, quản trị viên
UC-13
Xem danh sách bộ sưu tập	Khách hàng, nhân viên, quản trị viên
UC-14
Xem thông tin chi tiết bộ sưu tập	 Khách hàng, nhân viên, quản trị viên
UC-15
Xem bình luận bộ sưu tập	Khách hàng, nhân viên, quản trị viên
UC-16	Thêm bình luận bộ sưu tập	Khách hàng, nhân viên, quản trị viên
UC-17	Sửa bình luận bộ sưu tập	Khách hàng, nhân viên, quản trị viên
UC-18	Xóa bình luận bộ sưu tập	Khách hàng, nhân viên, quản trị viên
UC-19	Thêm sản phẩm vào giỏ hàng	Khách hàng, nhân viên, quản trị viên
UC-20	Xem giỏ hàng	Khách hàng, nhân viên, quản trị viên
UC-21	Cập nhật sản phẩm trong giỏ hàng (số lượng, thuộc tính)	Khách hàng, nhân viên, quản trị viên
UC-22	Xóa sản phẩm khỏi giỏ hàng	Khách hàng, nhân viên, quản trị viên
UC-23	Xem tổng số tiền giỏ hàng	Khách hàng, nhân viên, quản trị viên
UC-24	Chọn mã giảm giá cho đơn hàng	Khách hàng, nhân viên, quản trị viên
UC-25	Nhập mã giảm giá/voucher	Khách hàng, nhân viên, quản trị viên
UC-26	Chọn phương thức thanh toán (COD, thẻ tín dụng, ví điện tử, momo, paypal,…)	Khách hàng, nhân viên, quản trị viên
UC-27	Xác nhận đơn hàng	Khách hàng, nhân viên, quản trị viên
UC-28	Xem danh sách đơn hàng đã đặt	Khách hàng, nhân viên, quản trị viên
UC-29	Xem chi tiết đơn hàng	Khách hàng, nhân viên, quản trị viên
UC-30	Hủy đơn hàng (trước khi vận chuyển)	Khách hàng, nhân viên, quản trị viên
UC-31	Đánh giá sao cho sản phẩm	Khách hàng, nhân viên, quản trị viên
UC-32	Chỉnh sửa đánh giá	Khách hàng, nhân viên, quản trị viên
UC-33	Xóa đánh giá	Khách hàng, nhân viên, quản trị viên
UC-34	Thêm sản phẩm vào yêu thích	Khách hàng, nhân viên, quản trị viên
UC-35	Xem danh sách sản phẩm yêu thích	Khách hàng, nhân viên, quản trị viên
UC-16
Xóa sản phẩm khỏi danh sách yêu thích	Khách hàng, nhân viên, quản trị viên
UC-37	Xem danh sách sản phẩm (công khai và ẩn)	Nhân viên, quản trị viên
UC-38	Thêm mới sản phẩm	Nhân viên, quản trị viên
UC-39	Cập nhật thông tin sản phẩm	Nhân viên, quản trị viên
UC-40	Xóa sản phẩm	Nhân viên, quản trị viên
UC-41	Xem danh sách thuộc tính sản phẩm	Nhân viên, quản trị viên
UC-42	Thêm thuộc tính sản phẩm	Nhân viên, quản trị viên
UC-43	Sửa thuộc tính sản phẩm	Nhân viên, quản trị viên
UC-44	Xóa thuộc tính sản phẩm	Nhân viên, quản trị viên
UC-45	Xem danh sách danh mục  (công khai và ẩn)	Nhân viên, quản trị viên
UC-46	Thêm danh mục sản phẩm	Nhân viên, quản trị viên
UC-47	Sửa danh mục sản phẩm	Nhân viên, quản trị viên
UC-48	Xóa danh mục sản phẩm	Nhân viên, quản trị viên
UC-49	Xem danh sách bộ sưu tập (công khai và ẩn)	Nhân viên, quản trị viên
UC-50	Thêm bộ sưu tập	Nhân viên, quản trị viên
UC-51	Sửa thông tin bộ sưu tập	Nhân viên, quản trị viên
UC-52	Xóa bộ sưu tập	Nhân viên, quản trị viên
UC-53	Xem danh sách đơn hàng	Nhân viên, quản trị viên
UC-54	Duyệt hoặc hủy đơn hàng.	Nhân viên, quản trị viên
UC-55	Cập nhật trạng thái đơn hàng (đang xử lý, đang giao, đã giao).	Nhân viên, quản trị viên
UC-56	Cập nhật trạng thái thanh toán (đã giao, chưa giao)	Nhân viên, quản trị viên
UC-57	Xuất hóa đơn cho đơn hàng	Nhân viên, quản trị viên
UC-58	Thêm đơn hàng (nếu khách hàng mua trực tiếp)	Nhân viên, quản trị viên
UC-59	Sửa đơn hàng	Nhân viên, quản trị viên
UC-60	Xóa đơn hàng	Nhân viên, quản trị viên
UC-61	Xem danh sách khách hàng 	Nhân viên, quản trị viên
UC-62	Thêm khách hàng	Nhân viên, quản trị viên
UC-63	Sửa thông tin khách hàng(trừ mật khẩu)	Nhân viên, quản trị viên
UC-64	Xóa tài khoản khách hàng (trừ admin)	Nhân viên, quản trị viên
UC-65	Xem danh sách bình luận và đánh giá	Nhân viên, quản trị viên
UC-66	 Xóa bình luận và đánh giá 	Nhân viên, quản trị viên
UC-67	Phản hồi đánh giá	Nhân viên, quản trị viên
UC-68	Thêm từ cấm bình luận	Nhân viên, quản trị viên
UC-69	Xóa từ cấm bình luận	Nhân viên, quản trị viên
UC-70	Xem danh sách mã giảm giá	Nhân viên, quản trị viên
UC-71	Thêm mã giảm giá	Nhân viên, quản trị viên
UC-72	Sửa mã giảm giá	Nhân viên, quản trị viên
UC-73	Xóa mã giảm giá	Nhân viên, quản trị viên
UC-74	Xem danh sách nhân viên	 Quản trị viên
UC-75	Thêm nhân viên	Quản trị viên
UC-76	Thêm vai trò	Quản trị viên
UC-77	Sửa vai trò	Quản trị viên
UC-78	Xóa vai trò	Quản trị viên
UC-79	Thêm tài khoản quản trị viên.	Quản trị viên
UC-80	Sửa tài khoản quản trị viên.	Quản trị viên
UC-81	Xem thống kê theo mục	Quản trị viên
UC-80	Quản lý hệ thống website	Quản trị viên
Bảng 4. Danh sách Usecase
4.2.	Đặc tả chi tiết hệ thống.
4.2.1.	Đặc tả khách hàng
4.2.1.1.	Đặc tả UseCase đăng ký (UC-01).
Mô tả chức năng:
Tên	Đăng ký vào hệ thống
Mô tả ngắn	Use-case này cho phép khách hàng mới tạo tài khoản mới vào   hệ thống.
Khách hàng mới nhập họ tên, email, mật khẩu để tạo tài khoản mới.
Tác nhân	Khách hàng (User).
Dòng sự kiện chính	Use case này bắt đầu khi một actor muốn đăng ký vào hệ thống. Trên giao diện màn hình chính , Khách vãng lai chọn Đăng ký.
Hệ thống yêu cầu các actor nhập họ tên, email, mật khẩu và mật khẩu xác nhận. Actor nhập họ tên, email, mật khẩu và mật khẩu xác nhận.
Hệ thống kiểm tra thông tin mà actor đã nhập, gửi xác nhận đến email của khách hàng và cho phép   đăng ký tài khoản mới.
Hệ thống thông báo đăng ký thành công và chuyển sang giao diện đăng nhập.
Dòng sự kiện khác	Nếu trong dòng sự kiện chính các actor nhập thông tin đăng ký sai định dạng thì hệ thống sẽ thông báo lỗi. Actor có thể quay trở về đầu dòng sự kiện hoặc hủy bỏ việc đăng ký lúc này use
case kết thúc.
Kết quả mong đợi	Thông báo cho khách hàng thành công hay không
Yêu cầu đặc biệt	Các yêu cầu đặc biệt Để đảm bảo tính an toàn cho hệ thống,
mỗi actor chỉ được quyền đăng ký với email duy nhất không trùng lặp.
Điều kiện
tiên quyết	 Email dùng để đăng ký tồn tại.
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì người đăng ký sẽ có
thể đăng nhập bằng tài khoản vừa tạo. Ngược lại trạng thái của hệ thống không đổi.
Bảng 5. Mô tả Usecase đăng ký
 
Biểu đồ tuần tự quá trình đăng ký:
 
Hình 17. Sơ đồ tuần tự đăng ký
Biểu đồ hoạt động quá trình đăng ký:

 
Hình 18. Sơ đồ hoạt động đăng ký
 
4.2.1.2.	Đặc tả UseCase đăng nhập (UC-02)
Mô tả chức năng:
Tên	Đăng nhập vào hệ thống
Mô tả ngắn	Use-case này cho phép thành viên đăng nhập hệ thống để thực  hiện một số chức năng mà khách vãng lai không có. Thành viên nhập email và mật khẩu để đăng nhập vào hệ thống
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn đăng nhập vào hệ  thống.
∙	Hệ thống yêu cầu các actor nhập email và mật khẩu. Actor       nhập email và mật khẩu.
∙	Hệ thống kiểm tra email và mật khẩu mà actor đã nhập và cho  phép actor đăng nhập vào hệ thống.
∙	Hệ thống thông báo đăng nhập thành công và lưu thông tin      đăng nhập vào session.
Dòng sự kiện khác	Nếu trong dòng sự kiện chính các actor nhập email và mật khẩu  sai thì hệ thống sẽ thông báo lỗi. Actor có thể quay trở về đầu dòng sự kiện hoặc hủy bỏ việc đăng nhập lúc này use case kết thúc.
Kết quả mong đợi	Thông báo cho actor thành công hay không
Yêu cầu đặc biệt	Các yêu cầu đặc biệt để đảm bảo tính an toàn cho hệ thống, mỗi actor chỉ được quyền nhập lại email và mật khẩu của mình nếu đăng nhập sai tối đa là 3 lần. Sau đó hệ thống sẽ tự động
kết thúc use case.
Điều kiện tiên quyết	 Phải có thông tin của actor trong hệ thống dữ liệu.
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì người đăng nhập sẽ
có các quyền sử dụng hệ thống tương ứng. Ngược lại trạng thái của hệ thống không đổi.
Bảng 6. Mô tả Usecase đăng nhập
 
Biểu đồ tuần tự quá trình đăng nhập:
 
Hình 19. Sơ đồ tuần tự đăng nhập
Biểu đồ hoạt động quá trình đăng nhập:
 
Hình 20. Sơ đồ hoạt động đăng nhập
4.2.1.3.	Đặc tả UseCase quên mật khẩu (UC-03).
Mô tả chức năng
Tên	 Quên mật khẩu 
Mô tả ngắn	Use-case này cho phép thành viên đặt lại mật khẩu khi chưa đăng nhập
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn đăng nhập vào hệ thống nhưng quên mật khẩu. 
∙	Hệ thống yêu cầu thành viên nhập email tài khoản và xác minh email để đặt lại mât khẩu mới. Thành viên nhập email và xác nhận email.
Dòng sự kiện khác	Nếu trong dòng sự kiện chính các actor nhập email sai hoặc không xác nhận đúng email thì hệ thống sẽ thông báo lỗi. Actor có thể quay trở về đầu dòng sự kiện hoặc hủy bỏ việc quên mật khẩu lúc này use case kết thúc.
Kết quả mong đợi	Thông báo cho actor thành công hay không
Yêu cầu đặc biệt	Các yêu cầu đặc biệt để đảm bảo tính an toàn cho hệ thống, mỗi actor chỉ được quyền nhập lại email và mật khẩu của mình nếu đăng nhập sai tối đa là 3 lần. Sau đó hệ thống sẽ tự động
kết thúc use case.
Điều kiện
tiên quyết	 Phải có thông tin email của thành viên trong hệ thống và thành viên phải xác nhận đúng email đã đăng ký trên hệ thống.
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì thành viên đăng nhập lại bằng mật khẩu mới thành công. Ngược lại trạng thái của hệ thống không đổi.
Bảng 7. Mô tả Usecase quên mật khẩu
 
Biểu đồ tuần tự quên mật khẩu
 
Hình 21. Sơ đồ tuần tự quên mật khẩu
Biểu đồ hoạt động quên mật khẩu
 
Hình 22. Sơ đồ hoạt động quên mật khẩu
4.2.1.4.	Đặc tả UseCase đổi mật khâu (UC-04)
Mô tả chức năng:
Tên	Đổi mật khẩu
Mô tả ngắn	Use-case này cho phép actor đăng nhập hệ thống để thực  hiện một số chức năng mà khách vãng lai không có
Actor đăng nhập vào hệ thống, xác nhận email và mật khẩu để đổi mật khẩu
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor đã đăng nhập vào hệ thống.
∙	Hệ thống yêu cầu các actor nhập lại email và mật khẩu.
  Actor nhập lại email và mật khẩu.
∙	Hệ thống kiểm tra email và mật khẩu mà actor đã nhập và cho phép actor đổi mật khẩu.
∙	Hệ thống thông báo đổi mật khẩu thành công và lưu thông tin  vào cơ sở dữ liệu.
Dòng sự kiện khác	Nếu trong dòng sự kiện chính các actor nhập email và mật khẩu  sai thì hệ thống sẽ thông báo lỗi. Actor có thể quay trở về đầu dòng sự kiện hoặc hủy bỏ việc đổi mật khẩu lúc này use case kết thúc.
Kết quả mong đợi	Thông báo cho khách hàng thành công hay không
Yêu cầu đặc biệt	Các yêu cầu đặc biệt Để đảm bảo tính an toàn cho hệ thống, mỗi actor chỉ được quyền nhập lại email và mật khẩu của mình sai tối đa là 3 lần. Sau đó hệ thống sẽ tự động kết thúc use case.
Điều kiện
tiên quyết	 Khách hàng có tài khoản trong hệ thống và đã đăng nhập rồi.
Điều kiện           cuối	 Không có
Bảng 8. Mô tả Usecase đổi mật khẩu
 
Biểu đồ tuần tự quá trình đổi mật khẩu:
 
Hình 23. Sơ đồ tuần tự đổi mật khẩu
Biểu đồ hoạt động quá trình đổi mật khẩu:
 
Hình 24. Sơ đồ hoạt động đổi mật khẩu
4.2.1.5.	Đặc tả UseCase quản lý thông tin cá nhân (UC-05).
Mô tả chức năng:
Tên	Xem và cập nhật thông tin tài khoản
Mô tả ngắn	Use-case này cho phép thành viên đăng nhập hệ thống để thực      hiện xem và cập nhật thông tin tài khoản cá nhân.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	Use case này bắt đầu khi một actor muốn xem và cập nhật tài khoản cá nhân.
Kết quả mong đợi	Thông báo cho actor thành công hay không
Điều kiện
tiên quyết	Các yêu cầu đặc biệt người dùng đã đăng nhập vào hệ thống.
Điều kiện  cuối	Hậu điều kiện nếu Use case thành công thì người đang sử dụng hệ thống đã thay đổi thông tin của chính mình. Ngược lại trạng thái                        của hệ thống không đổi.
Bảng 9. Mô tả Usecase quản lý thông tin cá nhân
Biểu đồ tuần tự quản lý thông tin tài khoản:
 
Hình 25. Sơ đồ tuần tự quản lý thông tin tài khoản
Biểu đồ hoạt động quản lý thông tin tài khoản:
 
Hình 26. Sơ đồ hoạt động quản lý thông tin tài khoản
4.2.1.6.	Đặc tả UseCase đăng xuất (UC-06).
Mô tả chức năng
Tên	Đăng xuất
Mô tả ngắn	Use-case này cho phép khách hàng đăng xuất khỏi hệ thống
Tác nhân	Khách hàng (User),nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	Use case này bắt đầu khi một actor muốn đăng xuất khỏi hệ thống.
Kết quả mong đợi	Thông báo cho khách hàng thành công hay không chuyển đến trang đăng nhập.
Điều kiện
tiên quyết	 Người dùng bắt buộc đăng nhập vào hệ thống mới thực hiện được chức năng này.
Điều kiện cuối	Hậu điều kiện Nếu Use case thành công thì người dùng đã đăng xuất khỏi hệ thống. Trạng thái của  hệ thống không đổi.

 
Biểu đồ tuần tự đăng xuất
 
Biểu đồ hoạt động đăng xuất
 
Hình 27 Sơ đồ hoạt động đăng xuất

4.2.1.7.	Đặc tả UseCase tìm kiếm sản phẩm (UC-07).
Mô tả chức năng:
Tên	Tìm kiếm sản phẩm
Mô tả ngắn	Use-case này cho phép người dùng tìm kiếm sản phẩm, mã sản phẩm, danh mục trong giao diện khách hàng của hệ thống.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một thành viên muốn tìm kiếm một sản phẩm hay danh mục nào đó theo nhu cầu của thành viên đó.
∙	Hệ thống yêu cầu các actor nhập thông tin tìm kiếm. Actor  nhập thông tin muốn tìm kiếm.
Dòng sự kiện khác	Nếu thành viên nhập thông tin tìm kiếm không có trong cơ sở dữ liệu của hệ thống thì hệ thống sẽ thông báo không có thông tin tìm kiếm đó.
Kết quả mong đợi	Hiện ra các sản phẩm hay danh mục chứa các từ mà thành viên đang tìm kiếm.
Điều kiện  cuối	Hậu điều kiện nếu Use case thành công thì người đăng nhập sẽ tìm được sản phẩm mong muốn. Trạng thài của hệ thống không đổi
Bảng 10. Mô tả Usecase quản lý tìm kiếm sản phẩm
Biểu đồ tuần tự tìm kiếm sản phẩm:
 
Hình 28. Sơ đồ tuần tự tìm kiếm sản phẩm
 
Biểu đồ hoạt động tìm kiếm sản phẩm:
 
Hình 29. Sơ đồ hoạt động tìm kiếm sản phẩm
4.2.1.8.	Đặc tả UseCase lọc sản phẩm (UC-08).
Mô tả chức năng:
Tên	Lọc sản phẩm
Mô tả ngắn	Use-case này cho phép tất cả thành viên lọc sản phẩm trong giao diện sản phẩm chi tiết của hệ thống.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một thành viên muốn lọc một sản phẩm nào đó theo nhu cầu của thành viên đó.
∙	Hệ thống yêu cầu các actor thao tác với bộ lọc (lọc theo giá, biến thể,..). Actor thực hiện thao tác lọc thông tin muốn tìm kiếm cho sản phẩm mong muốn.
Dòng sự kiện khác	Nếu thành viên nhập thông tin lọc không có trong cơ sở dữ liệu của hệ thống thì hệ thống sẽ thông báo không có thông tin đó.
Kết quả mong đợi	Hiện ra các sản phẩm chứa các yêu cầu lọc mà thành viên đang tìm kiếm.
Điều kiện  cuối	Hậu điều kiện nếu Use case thành công thì người đăng nhập sẽ tìm được 1 hoặc nhiều sản phẩm gần với mong muốn lọc nhất. Trạng thái của hệ thống không đổi
Bảng 11. Mô tả Usecase lọc sản phẩm
Biểu đồ tuần tự lọc sản phẩm:
 
Hình 30. Sơ đồ tuần tự lọc sản phẩm
Biểu đồ hoạt động lọc sản phẩm:
 
Hình 31. Sơ đồ tuần tự lọc sản phẩm


4.2.1.9.	Đặc tả UseCase xem sản phẩm. (UC-09, UC-10, UC-11)
Mô tả chức năng:
Tên	Xem sản phẩm
Mô tả ngắn	Use-case này cho phép actor hệ thống xem sản phẩm.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn xem sản phẩm.
∙	Hệ thống lấy dữ liệu danh sách sản phẩm từ database và hiển thị cho actor.
∙	 Actor muốn xem chi tiết sản phẩm. Hệ thống lấy dữ liệu chi  tiết sản phẩm hiển thị cho actor.
∙	 Ở trong chi tiết sản phẩm có mô tả, chính sách, và các đánh giá của sản phẩm, actor muốn đánh giá sản phẩm, hệ thống yêu cầu phải mua sản phảm đó.
Dòng sự kiện khác	Không có
Kết quả mong đợi	Hiển thị trên giao diện danh sách sản phẩm và chi tiết sản phẩm
Yêu cầu đặc biệt	Không có
Điều kiện
tiên quyết	Không có
Điều kiện cuối	Không có
Bảng 12. Mô tả Usecase xem sản phẩm
 
Biểu đồ tuần tự quá trình xem sản phẩm:
 
Hình 32. Sơ đồ tuần tự xem sản phẩm
Biểu đồ hoạt động quá trình xem sản phẩm:
 
Hình 33. Sơ đồ hoạt động xem sản phẩm
4.2.1.10.	Đặc tả UseCase mua sắm theo bộ sưu tập (UC-12, UC-13, UC-14, UC-15, UC-16, UC-17).
Mô tả chức năng:
Tên	Mua sắm theo bộ sưu tập
Mô tả ngắn	Use-case này cho phép thành viên xem thông tin bộ sưu tập. Có thể chọn mua từng sản phẩm hoặc mua toàn bộ sản phẩm.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn mua sản phẩm theo bộ sưu tập có sẵn.
∙	Hệ thống yêu cầu các actor thêm bộ sưu tập vào giỏ hàng rồi mua hoặc nhấn nút mua ngay tại trang chi tiết bộ sưu tập. Actor thêm bộ sưu tập vào giỏ hàng hoặc bỏ 1 số sản phẩm không mong muốn. Mua thêo bộ sưu tập sẽ được giảm giá. 
Dòng sự kiện khác	Nếu trong dòng sự kiện chính thành viên muốn mua bộ tập đó nhưng muốn lược bỏ một hoặc vài sản phẩm thì thành viên thực hiện loại bỏ các sản phẩm không muốn mua ra khỏi bộ sưu tập có sẳn và không còn được giảm giá
Kết quả mong đợi	Thông báo cho actor thành công hay không
Điều kiện
tiên quyết	 Thành viên mua hàng trực tuyến phải đăng nhập vào hệ thống. 
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì kết thúc use case và chuyển đến use case mới. Ngược lại trạng thái                   của hệ thống không đổi.
Bảng 13. Mô tả Usecase mua săm theo bộ sưu tập
 
Biểu đồ tuần tự mua sắm theo bộ sưu tập:
 
Hình 34. Sơ đồ tuần tự mua sắm theo bộ sưu tập
Biểu đồ hoạt động mua sắm theo bộ sưu tập:
 
Hình 35. Sơ đồ hoạt động mua sắm theo bộ sưu tập
4.2.1.11.	Đặc tả UseCase thêm sản phẩm vào giỏ hàng (UC-18).
Mô tả chức năng:
Tên	Thêm sản phẩm vào giỏ hàng
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “Thêm sản phẩm vào giỏ hàng” để đặt những sản phẩm mình cần mua vào không gian lưu trữ tạm thời trên web.
Tác nhân	Khách hàng (User)
Dòng sự kiện chính	∙	Trên giao diện màn hình chi tiết sản phẩm , Khách hàng chọn Thêm vào giỏ hàng.
∙	Hệ thống sẽ lưu trữ thông tin sản phẩm mà khách hàng đưa vào giỏ.
∙	Actor muốn xem chi tiết giỏ hàng. Hệ thống lấy dữ liệu giỏ hàng hiển thị cho actor.
Dòng sự kiện khác	Tại giao diện giỏ hàng sẽ có các chức năng: Xóa giỏ hàng, Cập nhật số lượng cho sản phẩm đã đặt, cập nhật thuộc tính sản phẩn, Xóa 1 hoặc  nhiều sản phẩm.
Kết quả mong đợi	Hiển thị trên giao diện danh sách sản phẩm trong giỏ hàng
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu khách hàng  phải thực hiện đăng nhập vào hệ thống
Điều kiện
tiên quyết	Không có
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ lưu  thông tin của sản phẩm và hiển thị  ra giao diện Giỏ hàng.
Bảng 14. Mô tả Usecase thêm sản phẩm vào giỏ hàng
 
Biểu đồ tuần tự quá trình thêm sản phẩm vào giỏ hàng:
 
Hình 36. Sơ đồ tuần tự thêm sản phẩm vào giỏ hàng
Biểu đồ hoạt động quá trình thêm giỏ hàng:
 
Hình 37. Sơ đồ hoạt động thêm sản phẩm vào giỏ hàng
4.2.1.12.	Đặc tả UseCase quản lý giỏ hàng (UC-19, UC-20, UC-21, UC-22). 
Mô tả chức năng
Tên	Đặt hàng
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “Xem, cập nhật, xoá” sản phẩm ở giỏ hàng
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Trên giao diện giỏ hàng , Khách hàng thành viên chọn Biểu tượng giỏ hàng
∙	Hệ thống sẽ hiển thị giao diện các sản phẩm mà khách hàng đã thêm vào giỏ trước đó. Hệ thống lấy dữ liệu giỏ hàng hiển thị cho actor.
∙	Actor muốn chỉnh sửa sản phẩm ở đơn hàng. Hệ thống cập nhật dữ liệu mới của sản phẩm trong đơn hàng.
∙	Actor muốn xoá sản phẩm khỏi đơn hàng. Hệ thống xoá sản phẩm cho actor.
Dòng sự kiện khác	Không có
Kết quả mong đợi	Hiển thị trên giao diện danh sách sản phẩm trong đơn hàng. Tại giao diện đặt hàng sẽ có các chức năng: Cập nhật số lượng cho sản phẩm, cập nhật thuộc tính sản phẩm, Xóa 1 hoặc nhiều sản phẩm, áp mã giảm giá.
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu khách hàng thành viên  phải thực hiện đăng nhập vào hệ thống.
Điều kiện tiên quyết	Trong giỏ hàng của khách hàng phải có tối thiểu 1 sản phẩm.
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ thông  báo thành công hay chưa.
Bảng 15. Mô tả UseCase quản lý giỏi hàng
 
Biểu đồ tuần tư quản lý giỏ hàng
 
Hình 38. Sơ đồ tuần tự quản lý giỏ hàng
Biểu đồ hoạt dộng quản lý giỏ hàng
 
Hình 39. Sơ đồ hoạt động quản lý giỏ hàng
4.2.1.13.	Đặc tả UseCase thanh toán (UC-23, UC-24, UC-25, UC-26).
Mô tả chức năng:
Tên	Đặt hàng
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “Đặt hàng”
để tham gia mua hàng .
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Trên giao diện giỏ hàng , Khách hàng thành viên chọn Mua hàng .
∙	Hệ thống sẽ hiển thị giao diện chứa thông tin khách hàng và danh sách các sản phẩm khách hàng đặt mua.
∙	Khách hàng có thể dùng các mã giảm giá của shop để áp dụng vào đơn hàng của mình (nếu có).
∙	 Sau đó khách hàng có thể xác nhận đặt hàng.
∙	Actor muốn xem chi tiết đơn hàng. Hệ thống lấy dữ liệu đơn hàng hiển thị cho actor.
Dòng sự kiện khác	Nếu Khách hàng áp mã giảm giá thì thực hiện giảm giá cho đơn hàng.
Kết quả mong đợi	Hiển thị trên giao diện danh sách sản phẩm đặt hàng. Tại giao diện đặt hàng sẽ có các chức năng: Cập nhật số lượng cho sản phẩm, cập nhật thuộc tính sản phẩm, Xóa 1 hoặc nhiều sản phẩm, áp mã giảm giá.
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu khách hàng thành viên phải thực hiện đăng nhập vào hệ thống.
Điều kiện tiên quyết	Trong giỏ hàng của khách hàng phải có tối thiểu 1 sản phẩm.
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ thông báo mua hàng thành công hay chưa.
Bảng 16. Mô tả Usecase thanh toán
 
Biểu đồ tuần tự thanh toán:

 
Hình 40. Sơ đồ tuần tự thanh toán
 
Biểu đồ hoạt động quá trình thêm giỏ hàng:
 
Hình 41. Sơ đồ hoạt động thanh toán
4.2.1.14.	Đặc tả UseCase theo dõi đơn hàng (UC-27, UC-28, UC-29).
Mô tả chức năng:
Tên	Theo dõi đơn hàng
Mô tả ngắn	Use-case này cho phép thành viên xem thông tin các đơn hàng.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn theo dõi trạng thái  các đơn hàng đã đặt mua trước đó. 
∙	Hệ thống yêu các actor thao tác với đơn hàng, có thể xem hoặc huỷ bỏ những đơn hàng chưa được xử lý,
Dòng sự kiện khác	Hệ thống cho phép người dùng người dùng đánh giá các sản phẩm đã mua trong đơn hàng hoàn thành.
Kết quả mong đợi	Hiển thị thông tin,, trạng thái các đơn hàng. Có thể huỷ được các đơn hàng chưa xử lý và cập nhật cho admin.
Điều kiện
tiên quyết	 Thành viên mua hàng trực tuyến phải đăng nhập vào hệ thống. Đã từng đặt mua các đơn hàng tại website. 
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì kết thúc use case và chuyển đến use case mới. Ngược lại trạng thái                   của hệ thống không đổi.

Biểu đồ tuần tự theo dõi đơn hàng:
 
Hình 42. Sơ đồ tuần tự tìm theo dõi đơn hàng
Biểu đồ hoạt động theo dõi đơn hàng:
 
Hình 43. Sơ đồ hoạt động theo dõi đơn hàng
4.2.1.15.	Đặc tả UseCase đánh giá sản phẩm (UC-30, UC-31, UC-32, UC-33).
Mô tả chức năng:
Tên	Thêm đánh giá sản phẩm  
Mô tả ngắn	Use-case này cho phép thành viên đăng nhập hệ thống để thêm bình luận.
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn thêm đánh giá trong một sản phẩm nào đó.
Dòng sự kiện khác	Nếu trong dòng sự kiện chính các actor nhập nội dung cấm hoặc sửa lại bình luận có nội dung cấm thì hệ thống thông báo cho người dùng vi phạm tiêu chuẩn cộng đồng.
Kết quả mong đợi	Thông báo cho actor thành công hay không
Điều kiện
tiên quyết	 Thành viên đã đăng nhập vào hệ thống. 
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì thành viên có thể  sửa hoặc xóa bình luận của bản thân. Ngược lại trạng thái  của hệ thống không đổi.
Bảng 17. Mô tả Usecase đánh giá sản phẩm
Biểu đồ tuần tự đánh giá sản phẩm:
 
Hình 44. Sơ đồ tuần tự đánh giá sản phẩm
Biểu đồ hoạt động đánh giá sản phẩm:
 
Hình 45. Sơ đồ hoạt động đánh giá sản phẩm
4.2.1.16.	Đặc tả UseCase quản lý phẩm yêu thích (UC-34, UC-35, UC-36).
Mô tả chức năng:
Tên	Quản lý sản phẩm yêu thích
Mô tả ngắn	Use-case này cho phép thành viên thêm sản phẩm vào danh sách yêu thích
Tác nhân	Khách hàng (User), nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Use case này bắt đầu khi một actor muốn thêm sản phảm hoặc xóa sản phẩm khỏi danh sách yêu thích.
Dòng sự kiện khác	Hệ thông cho phép người dùng nhấn vào icon trái tim để thêm vào hoặc bỏ sản phẩm ra khỏi danh sách yêu thích.
Kết quả mong đợi	Thông báo cho actor thành công hay không
Yêu cầu đặc biệt	Thành viên phân biệt được sản phẩm đã thêm vào danh sách yêu thích hoặc chưa
Điều kiện
tiên quyết	 Thành viên đã đăng nhập mới thực hiện được
Điều kiện  cuối	Hậu điều kiện Nếu Use case thành công thì người đăng nhập sẽ xem được danh sách sản phẩm yêu thích . Trạng thái  của hệ thống không đổi.
Bảng 18. Mô tả Usecase quản lý sản phẩm yêu thích
Biểu đồ tuần tự quản lý sản phẩm yêu thích:
 
Hình 46. Sơ đồ tuần tự quản lý sản phẩm yêu thích
Biểu đồ hoạt động quản lý sản phẩm yêu thích:
 
Hình 47. Sơ đồ hoạt động quản lý sản phẩm yêu thích
4.2.2.	Đặc tả admin
4.2.2.1.	Đặc tả UseCase xem danh sách sản phẩm (UC-37)
UC-41, UC-45, UC-49, UC-53, UC-61, UC-65, UC-70, UC-74 Tương tự
Mô tả chức năng
Tên	Thêm
Mô tả ngắn	Use-case này cho phép quản trị viên “Xem danh sách sản phẩm” của trang web
Tác nhân	Nhân viên (Staff), quản trị viên (Admin).
Dòng sự kiện chính	∙	Trên giao diện dashboard, actor chọn Danh sách sản phẩm.
∙	Hệ thống sẽ hiển thị giao diện danh sách sản phẩm. Sau khi hiển thị đầy đủ sản phẩm, actor có thể xem theo bộ lọc.
Dòng sự kiện khác	Không có.
Kết quả mong đợi	Hiển thị sản phẩm trên giao diện danh sách sản phẩm.
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu actor phải thực  hiện đăng nhập vào hệ thống và có quyền hạn xem sản phẩm.
Điều kiện
tiên quyết	Không có.
Điều kiện cuối	Không có.
Bảng 19. Mô tả UseCase xem danh sách sản phẩm
Biểu đồ tuần tự xem danh sách sản phẩm
 
Hình 48. Sơ đồ tuần tự xem danh sách sản phẩm
Biểu đồ hoạt động xem danh sách sản phẩm
 
Hình 49. Sơ đồ hoạt động xem danh sách sản phẩm
4.2.2.2.	Đặc tả UseCase thêm sản phẩm (UC-38).
UC-42, UC-46, UC-50, UC-58, UC-62, UC-68, UC-75, UC-76, UC-79 Tương tự
Mô tả chức năng:
Tên	Thêm
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “thêm sản
phẩm” để thêm sản phẩm.
Tác nhân	Nhân viên (Staff), quản trị viên (Admin)
Dòng sự kiện chính	∙	Trên giao diện quản lý sản phẩm, actor chọn thêm sản phẩm 
∙	Hệ thống sẽ hiển thị giao diện thêm sản phẩm. Sau khi nhập   đầy đủ thông tin thì actor xác nhận thêm.
Dòng sự kiện khác	Nếu Nhân viên không muốn thêm sản phẩm thì chọn Hủy.
Kết quả mong đợi	Hiển thị sản phẩm mới thêm trên giao diện danh sách sản phẩm trong quản lý.
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu actor phải thực  hiện đăng nhập vào hệ thống và có quyền hạn thêm sản phẩm
Điều kiện
tiên quyết	 Tên sản phẩm không được trùng với sản phẩm trước đó đã tồn   tại trong hệ thống. 
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ thông báo thêm sản phẩm thành công hay chưa
Bảng 20. Mô tả Usecase thêm sản phẩm
Biểu đồ tuần tự quá trình thêm sản phẩm:
 
Hình 50. Sơ đồ tuần tự thêm sản phẩm
Biểu đồ hoạt động quá trình thêm sản phẩm:
 
Hình 51. Sơ đồ hoạt động thêm sản phẩm
4.2.2.3.	Đặc tả UseCase cập nhật sản phẩm (UC-39).
UC-43, UC-47, UC-51, UC-55, UC-56, UC-59, UC-63, UC-72, UC-77, UC-80 Tương tự
Mô tả chức năng:
Tên	Cập nhật
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “cập nhật
sản phẩm” để cập nhật sản phẩm.
Tác nhân	 Admin
Dòng sự kiện chính	∙	Trên giao diện quản lý , actor chọn icon cập nhật sản phẩm 
∙	Hệ thống sẽ hiển thị giao diện cập nhật sản phẩm. Sau khi         nhập đầy đủ thông tin thì actor xác nhận cập nhật.
Dòng sự kiện khác	Nếu Nhân viên không muốn cập nhật sản phẩm thì chọn Hủy.
Kết quả mong đợi	Thông tin sản phẩm được thay đổi sau khi cập nhật hiển thị trên giao diện danh sách sản phẩm quản lý
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu Nhân viên phải thực hiện đăng nhập vào hệ thống và có quyền hạn cập nhật sản phẩm
Điều kiện
tiên quyết	 Tên sản phẩm không được trùng với sản phẩm trước đó đã tồn   tại trong hệ thống.
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ thông báo cập nhật sản phẩm thành công hay chưa
Bảng 21. Bảng mô tả Usecase cập nhật sản phẩm
 
Biểu đồ tuần tự quá trình cập nhật sản phẩm:
 
Hình 52. Sơ đồ tuần tự cập nhật sản phẩm
Biểu đồ hoạt động quá trình cập nhật sản phẩm:
 
Hình 53. Sơ đồ hoạt động cập nhật sản phẩm
 
4.2.2.4.	Đặc tả UseCase xoá sản phẩm (UC-40).
UC-44, UC-48, UC-52, UC-60, UC-64, UC-66, UC-69, UC-73, UC-78 Tương tự
Mô tả chức năng:
Tên	Xoá 
Mô tả ngắn	Use-case này cho phép thành viên sử dụng usecase “xoá” để
xoá sản phẩm khỏi danh sách.
Tác nhân	Admin
Dòng sự kiện chính	∙	Trên giao diện quản lý , Nhân viên chọn icon xoá.
∙	Hệ thống sẽ hiển thị thông báo “Bạn có chắc chắn muốn xoá?”
∙	 Sau  khi actor xác nhận thì xóa sẽ xoá.
Dòng sự kiện khác	∙	Hệ thống sẽ hiển thị thông báo “Bạn có chắc chắn muốn xoá?”
Nếu actor không muốn xóa sản phẩm thì chọn Hủy
Kết quả mong đợi	Sản phẩm vừa xóa không còn hiển thị trên giao diện danh sách sản phẩm.
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu Nhân viên phải thực hiện đăng nhập vào hệ thống, và có quyền hạn xoá sản phẩm.
Điều kiện
tiên quyết	 Không có
Điều kiện cuối	Hậu điều kiện Sau khi thực hiện Use-case hệ thống sẽ thông báo xoá sản phẩm thành công hay chưa
Bảng 22. Mô tả Usecase xoá sản phẩm
 
Biểu đồ tuần tự quá trình xoá sản phẩm:
 
Hình 54. Sơ đồ tuần tự xoá sản phẩm
Biểu đồ hoạt động quá trình xoá sản phẩm:
 
Hình 55. Sơ đồ hoạt động xoá sản phẩm
4.2.2.5.	Đặc tả UseCase thống kê (UC-81).
Mô tả chức năng:
Tên	Xoá  sản phẩm
Mô tả ngắn	Use-case này cho phép quản trị viên sử dụng usecase “xem thống kê” để xem thống kê theo mục.
Tác nhân	Quản trị viên (Admin).
Dòng sự kiện chính	∙	Trên giao diện quản lý , quản trị viên chọn mục thống kê.
∙	Hệ thống sẽ hiển thị các danh mục thống kê theo ngày, tháng, năm, sản phẩm bán chạy, ….
Dòng sự kiện khác	Không có.
Kết quả mong đợi	Hiển thị các danh mục thống kê theo mục
Yêu cầu đặc biệt	Để thực hiện được usecase này yêu cầu quản trị viên phải thực hiện đăng nhập vào hệ thống.
Điều kiện
tiên quyết	 Không có.
Điều kiện cuối	Không có.
Bảng 23.Mô tả UseCase thống kê
Biểu đồ tuần tự thống kê:
 
Hình 56. Sơ đồ tuần tự thống kê
Biểu đồ hoạt động thống kê:
 
Hình 57. Sơ đồ hoạt động thống kê
4.2.3.	Sơ đồ luồng dữ liệu
 
Hình 58. Sơ đồ luồng dữ liệu mức 0
 
Hình 59. Sơ đồ luồng dữ liệu đăng ký mức 2
 
Hình 60. Sơ đồ luồng dưc liệu đăng nhập mức 2
 
Hình 61. Sơ đồ luồng dữ luêuj đổi mật khẩu mức 2
 
Hình 62. Sơ đồ luồng dữ liệu xem chi tiết sản phẩm mức 2
 
Hình 63. Sơ đồ luồng dữ liệu thêm vào giỏ hàng mức 2
 
Hình 64. Sơ đồ luồng dữ liệu thanh toán mức 2
 
Hình 65. Sơ đồ luồng dữ liệu quản lý sản phẩm mức 2
Chú thích: Các sơ đồ luồng dữ liệu quản lý, sơ đồ tuần tự, sơ đồ hoạt động của các chức năng quản lý khác tương tự như sơ đồ của chức năng quản lý sản phẩm
4.3.	Sơ đồ triển khai và yêu cầu hệ thống
4.3.1.	Sơ đồ triển khai
4.3.2.	Yêu cầu hệ thống 
Yêu cầu cần thiết triển khai hệ thống.
•	1 Database Server phục vụ lưu trữ dữ liệu Website.
•	1 Domain, Hosting để tạo trang web.
4.3.3.	Mô hình công nghệ ứng dụng
Kiến trúc hệ thống
•	Hệ thống được thiết kế theo mô hình Client – Server hoặc Local
o	Mô hình Client – Server
 
Hình 67. Mô hình client – server
o	Danh sách các thành phần trong mô hình Client – Server
Thành Phần	Giải Thích
Client	Máy khách truy cập cơ sở dữ liệu ở server và thực hiện
thao tác cần thiết
Server	Server chạy hệ quản trị cơ sở dữ liệu Oracle để xử lý và quản lý dữ liệu
Bảng 24. Thành phần mô hình client – server
o	Mô hình Local.
Thành phần	Giải Thích
Local	Chương trình chạy ở máy vừa cục bộ vừa có chức năng server
MySQL vừa có chức năng máy khách.
Bảng 25. Thành phần mô hình local
4.4.	Sơ đồ quan hệ thực thể (ERD) 
THÊM VÀO ERD CỦA DỰ ÁN MÌNH
Hình 69. Sơ đồ thực thể ERD 
4.5.	Sơ đồ tổ chức giao diện (site map)
Tổ chức giao diện của trang khách hàng
THÊM VÀO SITEMAP CỦA TRANG KHÁCH HÀNG
Hình 70. Sơ đồ sitemap khách hàng
Tổ chức giao diện của trang quản lý
THÊM VÀO SITEMAP CỦA TRANG ADMIN
Hình 71. Sơ đồ sitemap quản lý
 
4.6.	Phác thảo mockup
4.6.1.	Trang chủ
 
Hình 72. Mockup trang chủ
4.6.2.	Trang giới thiệu

Hình 73. Mockup trang giới thiệu
 
4.6.3.	Trang sản phẩm

Hình 74. Mockup trang sản phẩm
 
4.6.4.	Trang bộ sưu tập

Hình 75. Mockup trang bộ sưu tập
 
4.6.5.	Trang thông tin tài khoản. 

Hình 76. Mockup trang thông tin tài khoản
 
4.6.6.	Trang giỏ hàng 

Hình 77. Mockup trang giỏ hàng
 
THỰC HIỆN DỰ ÁN
5.1.	Tạo CSDL với MySQL
CHỤP CƠ SỞ DỮ LIỆU CỦA MÌNH THÊM VÀO
Hình 78. Sơ đồ cơ sở dữ liệu
5.1.	Mô hình MVC
Mô hình MVC (Model-View-Controller) là một kiến trúc phần mềm phổ biến, được sử dụng để tổ chức và phát triển ứng dụng một cách rõ ràng và hiệu quả. MVC chia ứng dụng thành ba thành phần chính: Model quản lý dữ liệu và logic nghiệp vụ, View chịu trách nhiệm hiển thị giao diện người dùng, và Controller xử lý yêu cầu từ người dùng, điều phối dữ liệu giữa Model và View. Cách phân chia này giúp tăng tính linh hoạt, dễ bảo trì, và hỗ trợ mở rộng ứng dụng. MVC cho phép các nhóm làm việc song song trên giao diện, dữ liệu, và logic mà không gây ảnh hưởng lẫn nhau, giúp cải thiện hiệu suất phát triển và quản lý dự án.
5.2.	Công nghệ quản lý dự án
5.3.1.	Quản lý sources code bằng Github
GitHub là một hệ thống quản lý dự án và phiên bản code, hoạt động giống như một mạng xã hội cho lập trình viên. Các lập trình viên có thể clone lại mã nguồn từ một repository và Github chính là một dịch vụ máy chủ repository công cộng, mỗi người có thể tạo tài khoản trên đó để tạo ra các kho chứa của riêng mình để có thể làm việc.
 
Hình 79. Quản lý code trên github
 
Hình 80. Quản lý code trên github
5.3.2.	Quản lý tiến độ công việc bằng Trello
Trello là công cụ quản lý công việc linh hoạt, nơi các nhóm có thể lập kế hoạch, cộng tác trên các dự án, tổ chức quy trình làm việc và theo dõi tiến độ một cách trực quan, hiệu quả và bổ ích. Từ lên ý tưởng, lập kế hoạch cho đến thực hiện, Trello quản lý các dấu mốc quan trọng và những nhiệm vụ hàng ngày khi làm việc cùng nhau và giúp nhóm hoàn thành công việc.

 
Hình 81. Quản lý dự án tiến độ ở trello
5.4.	Cấu trúc tổ chức code
Cấu trúc mã nguồn của một website bán hàng nội thất cần được thiết kế sao cho dễ dàng bảo trì, mở rộng và tối ưu hóa. Việc áp dụng mô hình MVC (Model-View-Controller) giúp tách biệt rõ ràng giữa các thành phần xử lý logic, giao diện người dùng và dữ liệu. Dưới đây là cấu trúc tổ chức mã nguồn chi tiết cho website bán hàng nội thất.
	Cấu trúc thư mục: 
  
Hình 82, Mô tả cấu trúc thư mục












KIỂM THỬ WEBSITE VÀ SỬA LỖI
5.3.	Xác định nhiệm vụ kiểm thử
Kiểm thử tập trung vào đảm bảo các chức năng hoạt động đúng theo đặc tả yêu cầu, bao gồm kiểm thử cho người dùng (khách hàng) và người quản trị.
	Đặc tả yêu cầu kiểm thử
5.3.1.	Đối với người dùng
5.3.1.1.	Đăng ký
•	Kiểm tra:
o	Họ và tên bắt buộc nhập, email phải đúng định dạng, mật khẩu lớn hơn 6 kí tự,mật khẩu xác nhận phải khớp với mật khẩu.
o	Kiểm tra thông báo lỗi nếu không nhập đầy đủ thông tin hoặc sai định dạng.
•	Kỳ vọng:
o	Người dùng đăng ký thành công khi nhập đúng thông tin và vào hộp thư gmail đã đăng ký để kích hoạt tài khoản.
o	Có thể chỉnh sửa thông tin tài khoản (tên, mật khẩu, email).
5.3.1.2.	Đăng nhập
•	Kiểm tra:
o	Nhập email và mật khẩu hợp lệ → truy cập hệ thống.
o	Nhập sai thông tin (email không tồn tại, mật khẩu sai) → hiện thông báo lỗi.
•	Kỳ vọng:
o	Đăng nhập thành công với thông tin hợp lệ.
o	Hiển thị thông báo lỗi rõ ràng khi đăng nhập thất bại.
5.3.1.3.	Quên mật khẩu
•	Kiểm tra:
o	Nhập đúng email đã đăng ký.
o	Gửi link đặt lại mật khẩu đến email hợp lệ.
o	Kiểm tra email với link đặt lại đúng hạn sử dụng.
•	Kỳ vọng:
o	Mật khẩu được đặt lại thành công.
5.3.1.4.	Đăng xuất
•	Kiểm tra:
o	Đăng xuất từ bất kỳ trạng thái hoạt động nào.
•	Kỳ vọng:
o	Người dùng được đăng xuất hoàn toàn.
5.3.1.5.	Giỏ hàng
•	Kiểm tra:
o	Thêm, xóa, chỉnh sửa sản phẩm trong giỏ hàng.
o	Đặt hàng thành công, chuyển tới trang thông báo.
•	Kỳ vọng:
o	Các thao tác giỏ hàng diễn ra suôn sẻ, chính xác.
5.3.1.6.	Thanh toán
•	Kiểm tra:
o	Thanh toán bằng tiền mặt, ví VNPay, hoặc các phương thức khác.
•	Kỳ vọng:
o	Thanh toán hiển thị chi tiết, chính xác.
5.3.1.7.	Bình luận
•	Kiểm tra:
o	Đăng nhập mới được phép bình luận.
o	Lọc bình luận không văn minh.
•	Kỳ vọng:
o	Hệ thống cấm hoặc xóa bình luận vi phạm.
5.3.1.8.	Tìm kiếm
•	Kiểm tra:
o	Tìm kiếm theo tên sản phẩm, danh mục.
•	Kỳ vọng:
o	Hiển thị kết quả chính xác theo từ khóa.
5.3.2.	Đối với người quản trị
5.3.2.1.	Quản lý người dùng
•	Kiểm tra:
o	Xem, thêm, sửa, xóa người dùng.
•	Kỳ vọng:
o	Các thay đổi được lưu lại và áp dụng ngay.
5.3.2.2.	Quản lý sản phẩm và thuộc tính
•	Kiểm tra:
o	Xem, thêm, sửa, xóa sản phẩm.
o	Xem, thêm, sửa, xóa thuộc tính
•	Kỳ vọng:
o	Sản phẩm và thuộc tính hiển thị đúng thông tin khi thao tác.
5.3.2.3.	Quản lý danh mục
•	Kiểm tra:
o	Xem, thêm, sửa, xóa danh mục.
•	Kỳ vọng:
o	Danh mục cập nhật chính xác.
5.3.2.4.	Quản lý bình luận
•	Kiểm tra:
o	Xem, Sửa, Duyệt, xóa bình luận vi phạm.
•	Kỳ vọng:
o	Bình luận bị xóa ngay lập tức khi quản trị viên thực hiện.
5.3.2.5.	Quản lý mã giảm giá
•	Kiểm tra:
o	Xem, tạo, chỉnh sửa, xóa mã giảm giá.
•	Kỳ vọng:
o	Mã giảm giá được áp dụng đúng chính sách.
5.3.2.6.	Quản lý phân quyền
•	Kiểm tra:
o	Gán vai trò, sửa, xóa cho từng người dùng.
•	Kỳ vọng:
o	Phân quyền hoạt động chính xác.
5.3.2.7.	Quản lý đơn hàng
•	Kiểm tra:
o	Thêm, Theo dõi, chỉnh sửa trạng thái, xóa đơn hàng.
•	Kỳ vọng:
o	Trạng thái cập nhật đúng theo thao tác.
STT	Testcase ID	Tên chức năng	Kết quả
1	TC001	Form đăng ký	Pass
2	TC002	Form đăng nhập	Pass
3	TC003	Form quên mật khẩu	Pass
4	TC004	Form cập nhật thông tin	Pass
5	TC005	Form thêm mới tài khoản	Pass
6	TC006	Form cập nhật tài khoản	Pass
7	TC007	Form thêm mới danh mục	Pass
8	TC008	Form cập nhật danh mục	Pass
9	TC009	Form thêm mới sản phẩm	Pass
10	TC010	Form cập nhật sản phẩm	Pass
11	TC011	Form thêm mới thuộc tính	Pass
12	TC012	Form cập nhật thuộc tính	Pass
13	TC013	Form thêm mới vai trò	Pass
14	TC014	Form cập nhật vai trò	Pass
15	TC015	Form thêm mới bộ sưu tập	Pass
16	TC016	Form cập nhật bộ sưu tập	Pass
17	TC017	Form thêm mới đơn hàng	Pass
18	TC018	Form cập nhật đơn hàng	Pass
19	TC019	Form thêm mới mã giảm giá	Pass
20	TC020	Form cập nhật mã giảm giá	Pass
Bảng 69. Tổng quát chức năng kiểm thử
5.4.	 Kiểm thử
	Người dùng
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form đăng ký	Kiểm tra đăng ký với dữ liệu hợp lệ	Họ và tên: Nguyễn Văn A
Email: a@gmail.com
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Mở form đăng ký
2. Nhập thông tin hợp lệ
3. Nhấn đăng ký	Hiển thị thông báo “Đăn ký thành công và mở email để kích hoạt tài khoản”	Pass	Pass
2	Form đăng ký	Kiểm tra đăng ký với email trùng lặp	Họ và tên: Nguyễn Văn A
Email: a@gmail.com (đã tồn tại)
Mật khẩu: 123456
Mật khẩu xác nhận: 123456	1. Mở form đăng ký
2. Nhập thông tin hợp lệ
3. Nhấn đăng ký	Hiển thị thông báo “Email đã tồn tại”	Pass	Pass
3	Form đăng ký	Kiểm tra đăng ký khi bỏ trống email	Họ tên: Nguyễn Văn A
Email: (trống)
Mật khẩu: 123456
Mật khẩu xác nhận: 123456	1. Mở form đăng ký.
2. Nhập Họ tên và Mật khẩu, mật khẩu xác nhận, để trống Email.
3. Nhấn "Đăng ký".	Hiển thị thông báo lỗi "Vui lòng nhập email".	Pass	Pass 
3	Form đăng ký	Kiểm tra đăng ký khi mật khẩu quá ngắn	Họ tên: Nguyễn Văn A
Email: a@gmail.com
Mật khẩu: 123
Mật khẩu xác nhận: 123	1. Mở form đăng ký
2. Nhập thông tin 
3. Nhấn đăng ký	Hiển thị thông báo “Mật khẩu phải lớn hơn 6 kí tự”	Pass	Pass
Bảng 70. Testcase form đăng ký	

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form đăng nhập	Kiểm tra đăng nhập với thông tin đúng	Email: a@gmail.com
Mật khẩu: 12345678	1. Mở form đăng nhập
2. Nhập thông tin
3. Nhấn nút “Đăng nhập”	Chuyển hướng trang chủ hoặc Dashboard	Pass	Pass
2	Form đăng nhập	Kiểm tra đăng nhập với mật khẩu sai	Email: a@gmail.com
Mật khẩu: 00000000	1. Mở form đăng nhập
2. Nhập thông tin
3. Nhấn nút “Đăng nhập”	Hiển thị thông báo lỗi “Mật khẩu không chính xác”	Pass	Pass
3	Form đăng nhập	Kiểm tra đăng nhập với email không tồn tại	Email: b@gmail.com
Mật khẩu: 12345678	1. Mở form đăng nhập
2. Nhập thông tin
3. Nhấn nút “Đăng nhập”	Hiển thị thông báo “Email không tồn tại”.	Pass	Pass
4	Form đăng nhập	Kiểm tra đăng nhập khi bỏ trống trường bắt buồn	Email: (trống)
Mật khẩu: 12345678	1. Mở form đăng nhập
2. Để trống email, nhập mật khẩu.
3. Nhấn nút “Đăng nhập”	Hiển thị thông báo lỗi “Vui lòng nhập email”	Pass	Pass
Bảng 71. Testcase đăng nhập

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form quên mật khẩu	Kiểm tra quên mật khẩu với email đúng	Email: a@gmail.com
1. Mở form quên mật khẩu
2. Nhập email
3. Nhấn nút gửi email đặt lại mật khẩu	Hiển thị thông báo “Kiểm tra email để đặt lại mật khẩu”	Pass	Pass
2	Form quên mật khẩu	Kiểm tra quên mật khẩu với email không tồn tại	Email: b@gmail.com
	1. Mở form quên mật khẩu
2. Nhập email
3. Nhấn nút gửi email đặt lại mật khẩu	Hiển thị thông báo “Email không tồn tại trong hệ thống”.	Pass	Pass
3

	Form quên mật khẩu	Kiểm tra quên mật khẩu với email để trống	Email: (để trống)	1. Mở form quên mật khẩu
2. Để trống email
3. Nhấn nút gửi email đặt lại mật khẩu	Hiển thị thông báo “Vui lòng nhập email”	Pass	Pass
Bảng 72. Testcase form quên mật khẩu

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng
thái
1	Form cập nhật thông tin	Kiểm tra cập nhật với dữ liệu hợp lệ	Họ & tên: Nguyễn Văn B
Email: b@gmail.com
Số điện thoại: 0942368245
Địa chỉ: Hòa An-Cẩm Lệ-Đà Nẵng	1. Đăng nhập.
2. Mở form cập nhật thông tin.
3. Nhập đầy đủ thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".	Pass 	Pass 
2	Form cập nhật thông tin	Kiểm tra khi để trống Họ &tên	Họ&Tên: (trống)
Email: b@gmail.com
Số điện thoại: 0942368245
Địa chỉ: Hòa An-Cẩm Lệ-Đà Nẵng	1. Đăng nhập.
2. Mở form cập nhật thông tin.
3. Để trống trường "Họ&tên".
4. Nhấn "Lưu".
	Hiển thị thông báo lỗi "Vui lòng nhập họ&tên".	Pass 	Pass 
3	Form cập nhật thông tin	Kiểm tra khi email không hợp lệ	Họ&tên: Nguyễn Văn B
Email: b@@gmail
Số điện thoại: 0942368245
Địa chỉ: Hòa An-Cẩm Lệ-Đà Nẵng	1. Đăng nhập.
2. Mở form cập nhật thông tin.
3. Nhập email không hợp lệ
4. Nhấn "Lưu".
	Hiển thị thông báo lỗi “Vui lòng nhập email hợp lệ”	Pass 	Pass 
4	Form cập nhật thông tin	Kiểm tra khi để trống email	Họ&tên: Nguyễn Văn B
Email: (trống)
Số điện thoại: 0942368245
Địa chỉ: Hòa An-Cẩm Lệ-Đà Nẵng	1. Đăng nhập.
2. Mở form cập nhật thông tin.
3. Để trống trường "Email".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập email".	Pass	Pass
Bảng 73. Test case form cập nhật thông tin
	Người quản trị
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới tài khoản	Kiểm tra thêm tài khoản với dữ liệu hợp lệ	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng hoặc admin
Số điện thoại: 0942368245
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Nhập đầy đủ thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Thêm tài khoản thành công".	Pass 	Pass 
2	Form thêm mới tài khoản	Kiểm tra khi email đã tồn tại	Email: a@gmail.com (đã tồn tại)
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng
Số điện thoại: 0942368245
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Nhập email đã tồn tại.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Email đã tồn tại".	Pass	Pass
3	Form thêm mới tài khoản	Kiểm tra khi mật khẩu và mật khẩu xác nhận không khớp	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng
Số điện thoại: 0942368245
Mật khẩu: 12345678
Mật khẩu xác nhận: 87654321	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Nhập mật khẩu và mật khẩu xác nhận không khớp.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Mật khẩu xác nhận không khớp".	Pass	Pass
4	Form thêm mới tài khoản	Kiểm tra khi để trống trường email	Email: (trống)
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng
Số điện thoại: 0942368245
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Để trống trường email.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập email".	Pass 	Pass 
5	Form thêm mới tài khoản	Kiểm tra khi số điện thoại không hợp lệ	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng
Số điện thoại: abc123
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Nhập số điện thoại sai định dạng.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Số điện thoại không hợp lệ"	Pass 	Pass 
6	Form thêm mới tài khoản	Kiểm tra khi không chọn vai trò	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: (trống)
Số điện thoại: 0942368245
Mật khẩu: 12345678
Mật khẩu xác nhận: 12345678	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Để trống trường "Vai trò".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng chọn vai trò".	Pass 	Pass 
7	Form thêm mới tài khoản	Kiểm tra khi nhập mật khẩu quá ngắn	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Chọn vai trò: Khách hàng
Số điện thoại: 0942368245
Mật khẩu: 123
Mật khẩu xác nhận: 123	1. Đăng nhập với quyền admin.
2. Truy cập form "Thêm tài khoản".
3. Nhập mật khẩu quá ngắn.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi “Mật khẩu phải từ 6 kí tự trở lên. ”	Pass 	Pass 
Bảng 74. Test case form thêm mới tài khoản

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật tài khoản	Kiểm tra cập nhật tài khoản với dữ liệu hợp lệ	Email: c@gmail.com
Tên đầy đủ: Nguyễn Văn C
Số điện thoại: 0942368245
Vai trò: Admin hoặc Khách hàng
Trạng thái: Kích hoạt	1. Đăng nhập với quyền admin.
2. Truy cập danh sách tài khoản.
3. Chọn tài khoản cần cập nhật.
4. Nhập dữ liệu hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".	Pass	Pass 
2	Form cập nhật tài khoản	Kiểm tra khi cập nhật với email không hợp lệ	Email: c@@gmail
Tên đầy đủ: Nguyễn Văn C
Số điện thoại: 0942368245
Vai trò: Admin
Trạng thái: Kích hoạt	1. Đăng nhập với quyền admin.
2. Truy cập danh sách tài khoản.
3. Chọn tài khoản cần cập nhật.
4. Nhập email không hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Email không hợp lệ".	Pass 	Pass 
3	Form cập nhật tài khoản	Kiểm tra khi để trống trường tên người dùng	Email: c@gmail.com
Tên đầy đủ: (trống)
Số điện thoại: 0942368245
Vai trò: Admin
Trạng thái: Kích hoạt	1. Đăng nhập với quyền admin.
2. Truy cập danh sách tài khoản.
3. Chọn tài khoản cần cập nhật.
4. Để trống trường "Tên đầy đủ".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập tên".	Pass 	Pass 
4	Form cập nhật tài khoản	Kiểm tra khi eamail bị trùng lặp với tài khoản khác	Email: a@gmail.com (đã tồn tại)
Tên đầy đủ: Nguyễn Văn C
Số điện thoại: 0942368245
Vai trò: Admin
Trạng thái: Kích hoạt	1. Đăng nhập với quyền admin.
2. Truy cập danh sách tài khoản.
3. Chọn tài khoản cần cập nhật.
4. Nhập email đã tồn tại.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Email đã tồn tại".	Pass 	Pass 
Bảng 75. Testcase form cặp nhật tài khoản
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới danh mục	Kiểm tra thêm danh mục với dữ liệu hợp lệ	Tên danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập form thêm danh mục.
3. Nhập dữ liệu hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Thêm mới thành công".	Pass 	Pass 
2	Form thêm mới danh mục	Kiểm tra khi để trống tên danh mục	Tên danh mục: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm danh mục.
3. Để trống trường "Tên danh mục".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập tên danh mục".	Pass 	Pass 
3	Form thêm mới danh mục	Kiểm tra khi nhập tên danh mục trùng lặp	Tên danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập form thêm danh mục.
3. Nhập tên danh mục đã tồn tại.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên danh mục đã tồn tại".	Pass 	Pass 
Bảng 76. Testcase form thêm mới danh mục

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật danh mục	Kiểm tra cập nhật danh mục với dữ liệu hợp lệ	Tên danh mục: Giường	1. Đăng nhập với quyền admin.
2. Truy cập danh sách danh mục.
3. Chọn danh mục cần cập nhật.
4. Nhập tên mới hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".	Pass 	Pass 
2	Form cập nhật danh mục	Kiểm tra khi để trống tên danh mục	Tên danh mục: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách danh mục.
3. Chọn danh mục cần cập nhật.
4. Để trống tên danh mục.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập tên danh mục".	Pass	Pass 
3	Form cập nhật danh mục	Kiểm tra khi nhập tên danh mục trùng lặp	Tên danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập danh sách danh mục.
3. Chọn danh mục cần cập nhật.
4. Nhập tên danh mục đã tồn tại.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên danh mục đã tồn tại".	Pass 	Pass 
Bảng 77. Testcase form cập nhật danh mục

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới sản phẩm	Kiểm tra thêm sản phẩm với dữ liệu hợp lệ	Tên: Ghế sofa
Mã sản phẩm: SOFA01
Số lượng:10
Giá tiền: 25.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập form thêm sản phẩm.
3. Nhập đầy đủ thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo “Thêm thành công.”	Pass 	Pass 
2	Form thêm mới sản phẩm	Kiểm tra khi để trống tên sản phẩm	Tên: (trống)
Mã sản phẩm: SOFA01
Số lượng: 10
Giá tiền: 25.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập form thêm sản phẩm.
3. Để trống trường "Tên sản phẩm".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên sản phẩm không được để trống".	Pass 	Pass 
3	Form thêm mới sản phẩm	Kiểm tra khi mã sản phẩm bị trung lặp	Tên: Ghế sofa
Mã sản phẩm: SOFA01 (đã tồn tại)
Số lượng: 10
Giá tiền: 25.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập form thêm sản phẩm.
3. Nhập mã sản phẩm đã tồn tại.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Mã sản phẩm đã tồn tại".	Pass 	Pass 
4	Form thêm mới sản phẩm	Kiểm tra khi không chọn danh mục sản phẩm	Tên: Ghế sofa
Mã sản phẩm: SOFA02
Số lượng: 10
Giá tiền: 25.000.000
Danh mục: (trống)
	1. Đăng nhập với quyền admin.
2. Truy cập form thêm sản phẩm.
3. Không chọn danh mục.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Danh mục không được để trống".	Pass 	Pass 
Bảng 78. Testcase form thêm mới sản phẩm

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật sản phẩm	Kiểm tra cập nhật sản phẩm với dữ liệu hợp lệ	Tên: Ghế sofa cao cấp
Mã sản phẩm: SOFA01
Số lượng: 20
Giá tiền: 30.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập danh sách sản phẩm.
3. Chọn sản phẩm cần cập nhật.
4. Nhập đầy đủ thông tin hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".	Pass 	Pass 
2	Form cập nhật sản phẩm	Kiểm tra khi để trống tên sản phẩm	Tên: (trống)
Mã sản phẩm: SOFA01
Số lượng: 20
Giá tiền: 30.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập danh sách sản phẩm.
3. Chọn sản phẩm cần cập nhật.
4. Để trống trường "Tên sản phẩm".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên sản phẩm là bắt buộc".	Pass 	Pass 
3	Form cập nhật sản phẩm	Kiểm tra mã sản phẩm bị trùng lặp	Tên: Ghế sofa
Mã sản phẩm: SOFA02 (đã tồn tại)
Số lượng: 10
Giá tiền: 25.000.000
Danh mục: Ghế	1. Đăng nhập với quyền admin.
2. Truy cập danh sách sản phẩm.
3. Chọn sản phẩm cần cập nhật.
4. Nhập mã sản phẩm đã tồn tại.
5. Nhấn  Lưu".	Hiển thị thông báo lỗi "Mã sản phẩm đã tồn tại".	Pass 	Pass 
Bảng 79. Testcase form cập nhật sản phẩm

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới thuộc tính	Kiểm tra thêm thuộc tính với dữ liệu hợp lệ	Tên thuộc tính: Màu sắc
Giá trị: đỏ, xanh, vàng	1. Đăng nhập với quyền admin.
2. Truy cập form thêm thuộc tính.
3. Nhập thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Thêm mới thành công".	Pass
	Pass 
2	Form thêm mới thuộc tính	Kiểm tra khi để trống tên thuộc tính	Tên thuộc tính: (trống)
Giá trị: đỏ, xanh , vàng	. Đăng nhập với quyền admin.
2. Truy cập form thêm thuộc tính.
3. Để trống trường "Tên thuộc tính".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên thuộc tính không được để trống".	Pass 	Pass 
Bảng 80. Testcase form thêm mới thuộc tính

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật thuộc tính	Kiểm tra cập nhật thuộc tính với dữ liệu hợp lệ	Tên thuộc tính: Kích thước
Giá trị: Lớn, Nhỏ	1. Đăng nhập với quyền admin.
2. Truy cập danh sách thuộc tính.
3. Chọn thuộc tính cần cập nhật.
4. Nhập dữ liệu hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".	Pass 	Pass 
2	Form cập nhật thuộc tính	Kiểm tra khi để trống tên thuộc tính	Tên thuộc tính: (trống)
Giá trị: Lớn, nhỏ	1. Đăng nhập với quyền admin.
2. Truy cập danh sách thuộc tính.
3. Chọn thuộc tính cần cập nhật.
4. Để trống trường "Tên thuộc tính".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên thuộc tính không được để trống"	Pass 	Pass 
Bảng 81. Testcase form cập nhật thuộc tính

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới vai trò	Kiểm tra thêm vai trò với dữ liệu hợp lệ	Tên vai trò: Nhân viên 	1. Đăng nhập với quyền admin.
2. Truy cập form thêmvai trò.
3. Nhập tên vai trò hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Thêm mới thành công".	Pass 	Pass 
2	Form thêm mới vai trò	Kiểm tra khi để trống tên vai trò	Tên vai trò: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập form thêmvai trò.
3. Để trống trường “tên vai trò”
4. Nhấn "Lưu".	Hiển thị thông báo lỗi “Tên vai trò không được để trống”	Pass 	Pass 
Bảng 82. Testcase form mới vai trò

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật vai trò	Kiểm tra cập nhật vai trò với dữ liệu hợp lệ	Tên vai trò: Nhân viên 	1. Đăng nhập với quyền admin.
2. Truy cập danh sáchquyền.
3. Chọn vai trò cần cập nhật.
4. Nhập dữ liệu hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "cập nhật  thành công".	Pass 	Pass 
2	Form cập nhật vai trò	Kiểm tra khi để trống tên vai trò	Tên vai trò: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách quyền.
3. Chọn vai trò cần cập nhật.
4. Để trống trường "Tên vai trò".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi “Tên vai trò không được để trống”	Pass 	Pass 
Bảng 83. Testcase form cập nhật vai trò

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới bộ sưu tập	Kiểm tra thêm bộ sưu tập với dữ liệu hợp lệ	Tên bộ sưu tập: mùa đông
Sản phẩm: ghế, bàn, đèn	1. Đăng nhập với quyền admin.
2. Truy cập form thêm bộ sưu tập.
3. Nhập đầy đủ thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo “thêm mới thành công”	Pass 	Pass 
2	Form thêm mới bộ sưu tập	Kiểm tra khi để trống tên bộ sưu tập	Tên bộ sưu tập: (trống)
Sản phẩm: ghế, bàn, đèn	1. Đăng nhập với quyền admin.
2. Truy cập form thêm bộ sưu tập.
3. Để trống trường "Tên bộ sưu tập".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên bộ sưu tập không được để trống".	Pass 	Pass 
3	Form thêm mới bộ sưu tập	Kiểm tra khi chọn ít hơn 3 sản phẩm	Tên bộ sưu tập: Mùa đồng
Sản phẩm: Ghế, bàn	1. Đăng nhập với quyền admin.
2. Truy cập form thêm bộ sưu tập.
3. Nhập tên hợp lệ.
4. Chọn 2 sản phẩm.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Cần chọn ít nhất 3 sản phẩm".
	Pass 	Pass 
Bảng 84. Testcase form thêm mới bộ sưu tập

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật bộ sưu tập	Kiểm tra cập nhật bộ sưu tập với dữ liệu hợp lệ	Tên bộ sưu tập: mùa đông
Sản phẩm: ghế, bàn, đèn	1. Đăng nhập với quyền admin.
2. Truy cập danh sách bộ sưu tập.
3. Chọn bộ sưu tập cần cập nhật.
4. Nhập đầy đủ thông tin hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo “thêm mới thành công”	Pass 	Pass 
2	Form cập nhật bộ sưu tập	Kiểm tra khi để trống tên bộ sưu tập	Tên bộ sưu tập: (trống)
Sản phẩm: ghế, bàn, đèn	1. Đăng nhập với quyền admin.
2. Truy cập danh sách bộ sưu tập.
3. Chọn bộ sưu tập cần cập nhật.
4. Để trống trường "Tên bộ sưu tập".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên bộ sưu tập không được để trống".	Pass 	Pass 
3	Form cập nhật bộ sưu tập	Kiểm tra khi chọn ít hơn 3 sản phẩm	Tên bộ sưu tập: Mùa đồng
Sản phẩm: Ghế, bàn	1. Đăng nhập với quyền admin.
2. Truy cập danh sách bộ sưu tập.
3. Chọn bộ sưu tập cần cập nhật.
4. Nhập tên hợp lệ.
5. Chọn 2 sản phẩm.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi "Cần chọn ít nhất 3 sản phẩm".
	Pass 	Pass 
Bảng 85. Testcase form cập nhật bộ sưu tập
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới đơn hàng	Kiểm tra thêm đơn hàng với dữ liệu hợp lệ	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Nhập đầy đủ các trường bắt buộc.
4. Chọn 1 sản phẩm và số lượng.
5. Nhấn "Lưu".	Hiển thị thông báo "Thêm đơn hàng thành công".	Pass 	Pass 
2	Form thêm mới đơn hàng	Kiểm tra khi để trống trường "Tên khách hàng"	Tên khách hàng: (trống)
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Để trống trường "Tên khách hàng".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên khách hàng là bắt buộc"	Pass 	Pass 
3	Form thêm mới đơn hàng	Kiểm tra khi để trống trường "Email"	Tên khách hàng: Nguyễn Văn A
Email: (trống)
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Để trống trường "Email".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Email là bắt buộc".Hiển thị thông báo lỗi "Email là bắt buộc".	Pass 	Pass 
4	Form thêm mới đơn hàng	Kiểm tra khi để trống trường "Số điện thoại"	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: (trống)
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Để trống trường "Số điện thoại".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Số điện thoại là bắt buộc".	Pass 	Pass 
5	Form thêm mới đơn hàng	Kiểm tra khi để trống trường "Địa chỉ giao hàng"	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: (trống)
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Để trống trường "Địa chỉ giao hàng".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Địa chỉ giao hàng là bắt buộc".
	Pass 	Pass 
6	Form thêm mới đơn hàng	Kiểm tra khi không chọn sản phẩm
	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mới đơn hàng.
3. Không chọn sản phẩm nào.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Sản phẩm là bắt buộc".	Pass 	Pass 
Bảng 86 . Testcase form thêm mới đơn hàng

STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật đơn hàng	Kiểm tra cập nhật đơn hàng với dữ liệu hợp lệ	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Nhập đầy đủ các trường bắt buộc.
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo “Cập nhật đơn hàng thành công".	Pass	Pass
2	Form cập nhật đơn hàng	Kiểm tra khi để trống trường "Tên khách hàng"	Tên khách hàng: (trống)
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Để trống trường “Tên khách hàng”
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi "Tên khách hàng là bắt buộc"	Pass	Pass
3	Form cập nhâtk đơn hàng	Kiểm tra khi để trống trường "Email"	Tên khách hàng: Nguyễn Văn A
Email: (trống)
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Để trống trường “Email”
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi “Email là bắt buộc”	Pass	Pass
4	Form cập nhật đơn hàng	Kiểm tra khi để trống trường "Số điện thoại"	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: (trống)
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Để trống trường “Số điện thoại”
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi "Số điện thoại là bắt buộc".	Pass	Pass
5	Form cập nhật đơn hàng	Kiểm tra khi để trống trường "Địa chỉ giao hàng"	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: (trống)
Sản phẩm: Ghế Sofa MOHO LYNGBY Gác L (SL: 1)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Để trống trường “Địa chỉ giao hàng”
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi "Địa chỉ giao hàng là bắt buộc".
	Pass	Pass
6	Form cập nhật đơn hàng	Kiểm tra khi không chọn sản phẩm
	Tên khách hàng: Nguyễn Văn A
Email: nguyenvana@gmail.com
Số điện thoại: 0942368245
Tỉnh/TP: Hà Nội
Quận/Huyện: Đống Đa
Phường/Xã: Láng Hạ
Địa chỉ giao hàng: 123 Láng Hạ
Sản phẩm: (trống)	1. Đăng nhập với quyền admin.
2. Truy cập danh sách đơn hàng.
3. Chọn đơn hàng cần cập nhật
4. Không chọn sản phẩm nào
5. Chọn 1 sản phẩm và số lượng.
6. Nhấn "Lưu".	Hiển thị thông báo lỗi "Sản phẩm là bắt buộc".	Pass	Pass
Bảng 87 . Testcase form cập nhật đơn hàng
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form thêm mới mã giảm giá	Kiểm tra thêm mã giảm giá với dữ liệu hợp lệ	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá trị: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Nhập đầy đủ thông tin hợp lệ.
4. Nhấn "Lưu".	Hiển thị thông báo "Thêm mã giảm giá thành công".	Pass 	Pass 
2	Form thêm mới mã giảm giá	Kiểm tra khi để trống trường "Mã giảm giá"	Mã giảm giá: (trống)
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Để trống trường "Mã giảm giá".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập mã giảm giá".	Pass 	Pass 
3	Form thêm mới mã giảm giá	Kiểm tra khi để trống "Tiêu đề mã"	Mã giảm giá: SALE50
Tiêu đề mã: (trống)
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Để trống trường "Tiêu đề mã".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập tiêu đề mã. ”	Pass 	Pass 
4	Form thêm mới mã giảm giá	Kiểm tra khi để trống “Ngày bắt đầu “	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: (trống)
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Để trống trường "Ngày bắt đầu".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập ngày bắt đầu".	Pass 	Pass 
5	Form thêm mới mã giảm giá	Kiểm tra khi ngày kết thúc trước ngày bắt đầu	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 12/31/2024
Ngày kết thúc: 11/22/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Nhập ngày kết thúc trước ngày bắt đầu.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Ngày kết thúc phải sau ngày bắt đầu".	Pass 	Pass 
6	Form thêm mới mã giảm giá	Kiểm tra khi để trống "Ngày kết thúc"	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: (trống)
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Để trống trường "Ngày kết thúc".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập ngày kết thúc".


	Pass 	Pass 






7	Form thêm mới mã giảm giá	Kiểm tra khi nhập giá trị giảm giá không hợp lệ (Âm)
	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá trị: -10
Giá tối thiểu: 100.000 VND
		1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Nhập giá trị giảm giá là số âm.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Giá trị giảm giá không hợp lệ".	Pass 	Pass 
8	Form thêm mới mã giảm giá	Kiểm tra khi giá tiền giảm giá vượt mức cho phép (Theo %)	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá trị: 150
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Nhập giá trị vượt mức ( >100%).
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Giá trị giảm giá không hợp lệ".	Pass 	Pass 
9	Form thêm mới mã giảm giá	Kiểm tra khi giá trị giảm giá vượt giá tối thiểu (Theo giá tiền)	Mã giảm giá: SALE100K
Tiêu đề mã: Giảm trực tiếp 100K
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo giá tiền
Giá tiền: 200.000 VND
Giá tối thiểu: 150.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Nhập giá tiên lớn hơn giá tối thiểu.
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Giá trị giảm giá không hợp lệ".	Pass 	Pass 
10	Form thêm mới mã giảm giá	Kiểm tra khi để trống trường giá tiền	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa hè
Ngày bắt đầu: 11/22/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: (trống)
Giá tối thiểu: 100.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập form thêm mã giảm giá.
3. Để trống trường "Giá tiền".
4. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập giá tiền giảm giá".	Pass 	Pass 
Bảng 88 . Testcase form thêm mới mã giảm giá
STT	Tên chức năng	Mô tả	Dữ liệu đầu vào	Bước thực hiện	Kết quả mong đợi	Kết quả thực tế	Trạng thái
1	Form cập nhật mã giảm giá	Kiểm tra cập nhật mã giảm giá với dữ liệu hợp lệ	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: 12/01/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Cập nhật thông tin hợp lệ.
5. Nhấn "Lưu".	Hiển thị thông báo "Cập nhật thành công".


	Pass 	Pass 
2	Form cập nhật mã giảm giá	Kiểm tra khi để trống trường "Tiêu đề mã"	Mã giảm giá: SALE50
Tiêu đề mã: (trống)
Ngày bắt đầu: 12/01/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Để trống trường "Tiêu đề mã".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập tiêu đề mã".	Pass 	Pass 
3	Form cập nhật mã giảm giá	Kiểm tra khi để trống trường “Ngày bắt đầu “	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: (trống)
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Để trống trường "Ngày bắt đầu".
5. Nhấn "Lưu".	Hiển thị thông báo “Vui lòng chọn ngày bắt đầu.”	Pass 	Pass 
4	Form cập nhật mã giảm giá	Kiểm tra khi ngày kết thúc trước ngày bắt đầu	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: 12/31/2024
Ngày kết thúc: 12/01/2024
Loại giảm giá: Theo %
Giá tiền: 50
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Nhập ngày kết thúc trước ngày bắt đầu.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi “Ngày kết thúc phải sau ngày bắt đầu.”	Pass 	Pass 
5	Form cập nhật mã giảm giá	Kiểm tra khi để trống trường “giá tiền”	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: 12/01/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá trị: (trống)
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Để trống trường "Giá trị".
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Vui lòng nhập giá tiền".


	Pass
	Pass 
6	Form cập nhật mã giảm giá	Kiểm tra khi giá tiền giảm giá không hợp lệ	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: 12/01/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: -10
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Nhập giá trị giảm giá âm.
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Giá tiền giảm giá không hợp lệ".


	Pass 	Pass 
7	Form cập nhật mã giảm giá	Kiểm tra khi giá tiền giảm giá vượt mức cho phép (Theo %)
	Mã giảm giá: SALE50
Tiêu đề mã: Giảm giá 50% mùa đông
Ngày bắt đầu: 12/01/2024
Ngày kết thúc: 12/31/2024
Loại giảm giá: Theo %
Giá tiền: 150
Giá tối thiểu: 200.000 VND	1. Đăng nhập với quyền admin.
2. Truy cập danh sách mã giảm giá.
3. Chọn mã giảm giá cần cập nhật.
4. Nhập giá tiền vượt mức ( >100%).
5. Nhấn "Lưu".	Hiển thị thông báo lỗi "Giá tiền giảm giá không hợp lệ".


	Pass 	Pass 
Bảng 89 . Testcase form cập nhật mã giảm giá
 
KẾT QUẢ WEBSITE
7.1.	Giao diện trang client
•	Trang chủ.
Giao diện:
 
Hình 83. Giao diện trang chủ (1)
 
Hình 84. Giao diện trang chủ (2)
 
Hình 85. Giao diện trang chủ (3)

Mô tả hoạt động:
TT	Điều khiển	Sự kiện	Mô tả hoạt động
1	Logo	Click	Trở về trang chính
2	Trang chủ	Click	Trở về trang chủ
3	Giới thiệu	Click	Hiển thị trang giới thiệu
4	Liên hệ	Click	Hiển thị trang liên hệ
5	Sản phẩm	Click	Hiển thị trang sản phẩm
6	Phòng	Click	Hiển thị trang các loại phòng
7	Tài khoản	Click	Hiển thị trang đăng nhập/đăng ký
8	Yêu thích	Click	Hiển thị trang sản phẩm yêu thích
9	Giỏ hàng	Click	Hiển thị trang giỏ hàng
Bảng 90. Mô tả điều khiển trang chính
•	Trang sản phẩm.
Giao diện:
 
Hình 86. Giao diện trang sản phẩm
Mô tả hoạt động:
TT	Điều khiển	Sự kiện	Mô tả hoạt động
1	 Bàn	Click	Hiển thị trang sản phẩm thuộc loại bàn
2	 Ghế	Click	Hiển thị trang sản phẩm thuộc loại ghế
3	Sản phẩm	Click	Hiển thị trang thêm sản phẩm trang trí
4	<	Click	Hiển thị sang trang sản phẩm trước
5	1,2,3…	Click	Hiển thị sang trang sản phẩm theo thứ tự
6	>	Click	Hiển thị sang trang sản phẩm sau
Bảng 91. Mô tả điều khiển trang sản phẩm
•	Trang chi tiết sản phẩm.
Giao diện:
 
Hình 87. Giao diện trang chi tiết sản phẩm
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Mô tả	Click	Hiển thị thông tin mô tả sản phẩm
2	Bình luận	btn_submit	Thêm dữ liệu bình luận vào database
3	Chính sách	Click	Hiển thị các chính sách giao hàng và bảo hành
4	Đánh giá	Click	Hiển thị các đánh giá sản phẩm từ người dùng khác
5	Mua hàng	Buy_now	Mua hàng
6	Thêm vào giỏ hàng	Add to cart	Thêm sản phẩm vào giỏ hàng
7	Thêm vào yêu thích	Add to list	Thêm sản phẩm vào yêu thích
Bảng 92. Bảng mô tả điều khiển chi tiết sản phẩm
•	Trang đăng ký tài khoản.
Giao diện:
 
Hình 88. Giao diện trang đăng ký
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Nhập vào trường	input	Theo đúng validate
2	Đăng kí	btn_add	Thêm dữ liệu người dùng vào database
Bảng 93. Mo tả điều khiển đăng ký
•	Trang đăng nhập.
Giao diện:
 
Hình 89. Giao diện trang đăng nhập
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Nhập vào trường	input	Theo đúng validate
2	Đăng nhập	btn_add	Thêm dữ liệu vào database
Bảng 94. Mô tả điều khiển đăng nhập
•	Trang quên mật khẩu.
Giao diện:
 
Hình 90. Giao diện trang quên mật khẩu
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Nhập vào trường	input	Theo đúng validate
2	Lấy mật khẩu	btn_forgot	Thêm dữ liệu vào database
Bảng 95. Mô tả điều khiển trang quên mật khẩu
 
•	Trang cập nhật thông tin tài khoản.
Giao diện:
 
Hình 91. Giao diện tràn cập nhật thông tin 
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Nhập vào trường	input	Theo đúng validate
2	Cập nhật	btn_edit	Cập nhật dữ liệu vào database

Bảng 96. Bảng mô tả điều khiển trang cập nhật thông tin
 
•	Trang đổi mật khẩu.
Giao diện:
 
Hình 92. Giao diện trang đổi mật khẩu
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Nhập vào trường	input	Theo đúng validate
2	Cập nhật	btn_change	Cập nhật dữ liệu vào database

Bảng 97. Mô tả điều khiển trang dổi mật khẩu
 
7.2.	Giao diện trang admin
•	Quản lý danh mục.
Giao diện:
 
Hình 93. Giao diện trang quản lý danh mục
 Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Cập nhật	btn_edit	Cập nhật dữ liệu vào database
2	Xoá	btn_delete	Xóa sản phẩm khỏi database
3	Thêm mới	btn_insert	Thêm dữ liệu vào database
4	Nhập lại	btn_reset	Xóa trống dữ liệu trên form
5	Danh sách	btn_list	Hiển thị danh sách loại sản phẩm
Bảng 98. Mô tả điều khiển quản lý danh mục
•	Quản lý sản phẩm.
Giao diện:
 
Hình 94. Giao diện quản lý sản phẩm
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Cập nhật	btn_edit	Cập nhật dữ liệu vào database
2	Xoá	btn_delete	Xóa sản phẩm khỏi database
3	Thêm mới	btn_insert	Thêm dữ liệu vào database
4	Nhập lại	btn_reset	Xóa trống dữ liệu trên form
5	Danh sách	btn_list	Hiển thị danh sách loại sản phẩm
Bảng 99. Mô tả điều khiển quản lý hàng hoá
•	Quản lý khách hàng.
Giao diện:
 
Hình 95. Giao diện trang quản lý thành viên
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Cập nhật	btn_edit	Cập nhật dữ liệu khách hàng vào database
2	Xoá		Xóa khách hàng khỏi database
3	Thêm mới	btn_insert	Thêm dữ liệu khách hàng vào database
4	Nhập lại	btn_reset	Xóa trống dữ liệu trên form
5	Danh sách	btn_list	Hiển thị danh sách khác hàng
Bảng 100. Mô tả điề khiển quản lý thành viên
•	Quản lý phân quyền.
Giao diện:
 
Hình 96. Giao diện trang quản lý phân quyền
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Xoá	btn_delete	Xóa vai trò khỏi database
2	Thêm	btn_add	Thêm vai trò vào database
3	Sửa	btn_edit	Sửa vai trò trong database
4	Danh sách	btn_list	Hiển thị danh sách vai trò, quyền hạn
Bảng 101. Mô tả điều khiển quản lý phân quyền
•	Quản lý bộ sưu tập.
Giao diện:
 
Hình 97. Giao diện trang quản lý bộ sưu tập
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Xóa	btn_delete	Xóa bộ sưu tập khỏi database
2	Thêm	btn_add	Thêm bộ sưu tập mới vào database
3	Sửa	btn_edit	Sửa bộ sưu tập trong database
4	Danh sách	btn_list	Xem danh sách bộ sưu tập
Bảng 102. Mô tả điều khiển quản lý bộ sưu tập
•	Thống kê.
Giao diện:
 
Hình 98. Giao diện thống kê
Mô tả hoạt động:
TT	Điều khiển	Tên	Giá trị
1	Chọn danh mục	Btn_categories	Chuyển đổi các danh mục thống kê
Bảng 103. Mô tả điều khiển thống kê
 
ĐÓNG GÓI VÀ TRIỂN KHAI
TT	THÀNH PHẦN	MÔ TẢ
1	File zip source	File upload host
2	Du-an-tot-nghiep.sql	Cơ sở dữ liệu
3	Readme.txt	Hướng dẫn upload website
4	Huongdanquantri.docx	Hướng dẫn sử dụng tài khoản quản trị
Bảng 104. Đóng gói và triển kahi
Hướng dẫn cài đặt
	Đăng ký hosting.
	Đăng ký domain.
 
KẾT LUẬN
5.5.	Khó khăn
Trong quá trình triển khai dự án, nhóm đã gặp nhiều thách thức, đặc biệt khi phát triển và tối ưu hóa các tính năng mới, dẫn đến việc hệ thống phát sinh lỗi cần khắc phục nhanh chóng. Đồng thời, việc sử dụng các công nghệ mới mà các thành viên chưa quen thuộc cũng gây khó khăn, buộc nhóm phải dành thời gian nghiên cứu và thử nghiệm, làm chậm một số giai đoạn phát triển.
5.6.	Thuận lợi
Dù gặp khó khăn, nhóm nhận được sự hỗ trợ từ giảng viên và tận dụng kinh nghiệm từ các dự án trước, giúp tổ chức công việc hiệu quả. Với tinh thần làm việc tích cực, các thành viên phối hợp tốt, hoàn thiện website Thế giới nội thất đúng tiến độ, đảm bảo ổn định và đáp ứng yêu cầu thực tế.
5.7.	 Hướng phát triển trong tương lai
Trong tương lai, website sẽ được nghiên cứu và nâng cấp hệ thông, hướng tới việc tối ưu hóa hiệu suất và bảo mật của website. Một số tính năng mới có thể được bổ sung như tích hợp thanh toán trực tuyến và xây dựng ứng dụng di động để mở rộng phạm vi sử dụng. Ngoài ra, nhóm sẽ cập nhật các xu hướng công nghệ mới để nâng cao trải nghiệm người dùng và đảm bảo website luôn đáp ứng tốt các nhu cầu thực tế. 
TÀI LIỆU THAM KHẢO
Laravel Documentation: https://laravel.com/docs
Blog chính thức của Laravel: https://blog.laravel.com 
Bootstrap: https://getbootstrap.com 
 Jquery Ajax: https://jquery.com 
Stack Overflow: https://stackoverflow.com 
…
 
BẢNG PHÂN CHIA CÔNG VIỆC 
ID	Công việc	Thời
gian	Ngày bắt
đầu	Ngày kết
thúc	Trạng
thái	Người
thực hiện	Ghi
chú
1	website thế giới nội thất	86 ngày	14/9/2024	04/12/2024	Đang làm	Tất cả thành
 viên	
2	Phân tích	5 ngày	15/9/2024	23/9/2024	Hoàn thành	Tất cả
Thành
 viên	
3	Phân tích yêu cầu khách hàng	2 ngày	15/9/2024	17/9/2024	Hoàn thành	Tất cả
thành 
viên	
4	Phân tích yêu cầu quản trị	2 ngày	17/9/2024	19/9/2024	Hoàn thành	Tất cả
thành 
viên	
5	Phân tích yêu cầu phi chức năng	1 ngày	21/9/2024	20/9/2024	Hoàn thành	Tất cả
Thành
 viên	
6	Phân tích yêu cầu công nghệ	1 ngày	20/9/2024	21/9/2024	Hoàn thành	Tất cả
thành 
viên	
7	Phân tích yêu cầu bảo mật	1 ngày	21/9/2024	22/9/2024	Hoàn thành	Tất cả
thành 
viên	
8	Phân tích tình trạng	1 ngày	22/9/2024	23/9/2024	Hoàn thành	Tất cả
thành 
viên	
9	Thiết kế	5 ngày	24/9/2024	28/9/2024	Hoàn thành	Tất cả
thành 
viên	
10	Lập kế hoạch	3 ngày	01/10/2024	03/10/2024	Hoàn thành	Tất cả
thành 
viên	
11	Coding	60 ngày	04/10/2024	25/11/2024	Hoàn thành	Tất cả thành
viên	
12	Đăng nhập	2 ngày	04/10/2024	05/10/2024	Hoàn
thành	Ngân	
13	Đăng kí	2 ngày	04/10/2024	05/10/2024	Hoàn
thành	Ngân	
14	Đăng xuất	1 ngày	04/10/2024	05/10/2024	Hoàn
thành	Ngân	
15	Đổi mật khẩu	1 ngày	04/10/2024	05/10/2024	Hoàn
thành	Ngân	
16	Quên mật khẩu	1 ngày	04/10/2024	05/10/2024	Hoàn
thành	Ngân	
17	Cập nhật thông tin	2 ngày	04/10/2024	05/10/2024	Hoàn
thành	Vũ	
18	Trang chủ	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Vi	
19	Trang tài khoản	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Vi	
20	Trang sản phẩm yêu thích	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Ngân	
21	Trang sản phẩm bán chạy	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Ngân	
22	Trang giỏ hàng	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Quân	
23	Trang bộ sưu tập	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Quân	
24	Trang chi tiết bộ sưu tập	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Quân	
25	Trang sản phẩm	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Uyên	
26	Trang liên hệ	10 ngày	04/10/2024	13/10/2024	Hoàn
thành	Uyên	
27	Chính sách, bảo mật	10 ngày	04/10/2024	13/10/2024	Hoàn thành	Uyên	
28	Header, Footer	10 ngày	04/10/2024	13/10/2024	Hoàn thanh	Vũ	
29	Trang chi tiết sản phẩm	10 ngày	04/10/2024	13/10/2024	Hoàn thanh	Vũ	
30	CRUD user	10 ngày	15/10/2024	24/10/2024	Hoàn thanh	Ngân	
31	Quản lý mã giảm giá	10 ngày	15/10/2024	24/10/2024	Hoàn thanh	Ngân	
32	CRUD danh mục	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Vi	
33	CRUD đánh giá, phản hồi	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Vi	
34	Hiển thị sản phẩm chi tiết	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Vũ	
35	CRUD sản phầm	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Vũ	
36	CRUD thuộc tính sản phẩm	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Vũ	
37	Cài đặt tài khoản	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Quân	
38	CRUD bộ sưu tập	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Quân	
39	Quản lý đơn hàng	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Uyên	
40	Hiển thị danh sách yêu thích	10 ngày	15/10/2024	24/10/2024	Hoàn
thành	Uyên	
41	CRUD giỏ hàng	10 ngày	25/10/2024	04/11/2024	Hoàn
thành	Quân	
42	Thêm sản phẩm
vào giỏ hàng	10 ngày	25/10/202	04/11/2024	Hoàn
thành	Quân	
43	Thống kê khách
hàng	10 ngày	25/10/202	04/11/2024	Hoàn
thành	Vũ	
44	Thống kê doanh thu	10 ngày	25/10/202	04/11/2024	Hoàn
thành	Vũ	
45	Thống kê sản phẩm	10 ngày	25/10/202	04/11/2024	Hoàn
thành	Vũ	
46	Thống kê đơn hàng	10 ngày	25/10/202	04/11/2024	Hoàn
thành	Vũ	
47	Thanh toán online	1 ngày	28/11/2024	1/12/2024	Hoàn thành	Vũ	
48	Trang thùng rác	1 ngày	28/12/2024	1/12/2024	Hoàn thành	Vũ	
49	Xuất hoá đơn	1 ngày	04/11/2024	04/11/2024	Hoàn
thành	Uyên	
50	Huỷ đơn hàng	1 ngày	04/11/2024	04/11/2024	Hoàn
thành	Uyên	
51	Xác nhận đơn hàng	1 ngày	04/11/2024	04/11/2024	Hoàn
thành	Uyên	
52	Phân quyền admin	7 ngày	15/10/2024	21/10/2024	Hoàn
thành	Quân	
45	Phân quyền nhân viên	7 ngày	15/10/2024	21/10/2024	Hoàn
thành	Quân	
46	Testing	14 ngày	10/11/2024	23/11/2024	Hoàn thành	Tất cả thành viên	
47	Lập kết hoạch testing plan	2 ngày	17/11/2024	19/11/2024	Hoàn
thành	Ngân	
48	System test	6 ngày	1/12/2024	12/12/2024	Hoàn thành	Tất cả thành viên	
49	Intergration test	6 ngày	1/12/2024	12/12/2024	Hoàn thành	Tất cả thành viên	
50	Tổng kết						


