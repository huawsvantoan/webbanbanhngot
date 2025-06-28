import * as Yup from 'yup';

export const bannerSchema = Yup.object({
  title: Yup.string()
    .required('Vui lòng nhập tiêu đề')
    .max(100, 'Tiêu đề tối đa 100 ký tự'),
  subtitle: Yup.string()
    .max(100, 'Phụ đề tối đa 100 ký tự'),
  description: Yup.string()
    .max(255, 'Mô tả tối đa 255 ký tự'),
  image: Yup.string()
    .required('Vui lòng nhập đường dẫn ảnh')
    .url('Đường dẫn ảnh không hợp lệ'),
  button_text: Yup.string()
    .max(30, 'Văn bản nút tối đa 30 ký tự'),
  button_link: Yup.string()
    .max(255, 'Đường dẫn nút tối đa 255 ký tự'),
  position: Yup.number()
    .typeError('Vị trí phải là số')
    .integer('Vị trí phải là số nguyên')
    .min(1, 'Vị trí phải lớn hơn 0')
    .required('Vui lòng nhập vị trí'),
  is_active: Yup.boolean(),
}); 