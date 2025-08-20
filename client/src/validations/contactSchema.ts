import * as yup from 'yup';

export const contactSchema = yup.object({
  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được quá 50 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/, 'Tên chỉ được chứa chữ cái và dấu cách'),

  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ')
    .max(100, 'Email không được quá 100 ký tự'),

  subject: yup
    .string()
    .required('Chủ đề là bắt buộc')
    .min(5, 'Chủ đề phải có ít nhất 5 ký tự')
    .max(100, 'Chủ đề không được quá 100 ký tự'),

  message: yup
    .string()
    .required('Tin nhắn là bắt buộc')
    .min(10, 'Tin nhắn phải có ít nhất 10 ký tự')
    .max(1000, 'Tin nhắn không được quá 1000 ký tự'),
});

export type ContactFormData = yup.InferType<typeof contactSchema>;
