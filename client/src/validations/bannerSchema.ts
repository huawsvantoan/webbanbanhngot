import * as Yup from 'yup';

export const bannerSchema = Yup.object({
  title: Yup.string()
    .max(100, 'Tiêu đề tối đa 100 ký tự'),
  description: Yup.string()
    .trim()
    .max(255, 'Mô tả tối đa 255 ký tự'),
  image_url: Yup.string()
    .test('is-valid-image-path', 'Đường dẫn ảnh không hợp lệ', function(value) {
      if (!value) return true; // Cho phép rỗng khi update
      
      // Chấp nhận đường dẫn tương đối bắt đầu bằng /
      if (value.startsWith('/')) return true;
      
      // Chấp nhận URL tuyệt đối
      if (value.startsWith('http://') || value.startsWith('https://')) return true;
      
      // Chấp nhận blob URL (cho preview)
      if (value.startsWith('blob:')) return true;
      
      return false;
    }),

  position: Yup.number()
    .typeError('Vị trí phải là số')
    .integer('Vị trí phải là số nguyên')
    .min(1, 'Vị trí phải lớn hơn 0')
    .max(100, 'Vị trí không được lớn hơn 100')
    .required('Vui lòng nhập vị trí'),
  is_active: Yup.number()
    .typeError('Trạng thái phải là số')
    .integer('Trạng thái phải là số nguyên')
    .min(0, 'Trạng thái phải là 0 hoặc 1')
    .max(1, 'Trạng thái phải là 0 hoặc 1'),
}); 