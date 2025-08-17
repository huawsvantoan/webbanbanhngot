import * as yup from 'yup';

export const orderSchema = yup.object({
  customer_name: yup
    .string()
    .required('Tên khách hàng là bắt buộc')
    .min(2, 'Tên khách hàng phải có ít nhất 2 ký tự')
    .max(100, 'Tên khách hàng không được quá 100 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên khách hàng chỉ được chứa chữ cái và dấu cách'),

  customer_phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9+\-\s()]+$/, 'Số điện thoại chỉ được chứa số và ký tự đặc biệt')
    .min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
    .max(15, 'Số điện thoại không được quá 15 ký tự'),

  customer_address: yup
    .string()
    .max(200, 'Địa chỉ không được quá 200 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ0-9\s,.-]+$/, 'Địa chỉ chỉ được chứa chữ cái, số, dấu cách và ký tự đặc biệt (,.-)'),

  payment_method: yup
    .string()
    .required('Phương thức thanh toán là bắt buộc')
    .oneOf(['cash', 'transfer'], 'Phương thức thanh toán không hợp lệ'),

  products: yup
    .array()
    .of(
      yup.object({
        product_id: yup
          .mixed()
          .test('is-valid-product-id', 'Vui lòng chọn sản phẩm', function(value) {
            return value !== null && value !== undefined && value !== '';
          }),
        name: yup
          .string()
          .required('Tên sản phẩm là bắt buộc'),
        price: yup
          .number()
          .required('Giá sản phẩm là bắt buộc')
          .min(0, 'Giá sản phẩm không được âm'),
        quantity: yup
          .number()
          .required('Số lượng là bắt buộc')
          .min(1, 'Số lượng phải ít nhất là 1')
          .max(100, 'Số lượng không được quá 100'),
      })
    )
    .min(1, 'Phải có ít nhất 1 sản phẩm')
    .max(10, 'Không được quá 10 sản phẩm'),

  total_amount: yup
    .number()
    .required('Tổng tiền là bắt buộc')
    .min(0, 'Tổng tiền không được âm'),
});

export interface OrderFormData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: 'cash' | 'transfer';
  products: Array<{
    product_id: number | null;
    name: string;
    price: number;
    quantity: number;
  }>;
  total_amount: number;
}
