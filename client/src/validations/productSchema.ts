import * as Yup from 'yup';

export const productSchema = Yup.object({
  name: Yup.string()
    .required('Vui lòng nhập tên sản phẩm')
    .max(100, 'Tên sản phẩm tối đa 100 ký tự'),
  description: Yup.string()
    .max(1000, 'Mô tả tối đa 1000 ký tự'),
  price: Yup.number()
    .typeError('Giá phải là số')
    .min(0, 'Giá không được âm')
    .required('Vui lòng nhập giá'),
  category_id: Yup.number()
    .typeError('Danh mục không hợp lệ')
    .required('Vui lòng chọn danh mục'),
  image: Yup.string()
    .url('Đường dẫn ảnh không hợp lệ'),
  stock: Yup.number()
    .typeError('Tồn kho phải là số')
    .integer('Tồn kho phải là số nguyên')
    .min(0, 'Tồn kho không được âm')
    .required('Vui lòng nhập tồn kho'),
  is_active: Yup.boolean(),
}); 