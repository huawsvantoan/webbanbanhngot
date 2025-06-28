import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/User';

// Mock data for demonstration purposes
let customers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    created_at: '2023-01-15T10:00:00Z',
    last_login: '2024-06-15T14:30:00Z',
    total_orders: 5,
    total_spent: 1500000,
    status: 'active',
    orders: [
      { id: 101, total_amount: 300000, status: 'completed', created_at: '2023-02-01T11:00:00Z' },
      { id: 102, total_amount: 450000, status: 'pending', created_at: '2023-03-10T12:00:00Z' },
    ],
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    created_at: '2022-11-20T09:00:00Z',
    last_login: '2024-06-14T10:00:00Z',
    total_orders: 8,
    total_spent: 2500000,
    status: 'inactive',
    orders: [
      { id: 201, total_amount: 500000, status: 'completed', created_at: '2023-01-05T10:00:00Z' },
      { id: 202, total_amount: 700000, status: 'cancelled', created_at: '2023-02-20T14:00:00Z' },
    ],
  },
];

let supportTickets = [
  {
    id: 1,
    customer_id: 1,
    customer_name: 'Nguyễn Văn A',
    subject: 'Vấn đề đăng nhập',
    message: 'Tôi không thể đăng nhập vào tài khoản của mình.',
    status: 'open',
    priority: 'high',
    created_at: '2024-06-16T09:00:00Z',
    updated_at: '2024-06-16T09:00:00Z',
  },
  {
    id: 2,
    customer_id: 2,
    customer_name: 'Trần Thị B',
    subject: 'Yêu cầu đổi hàng',
    message: 'Tôi muốn đổi sản phẩm đã mua.',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2024-06-15T11:00:00Z',
    updated_at: '2024-06-16T10:00:00Z',
  },
];

// @desc    Get all customers
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getAllCustomers = asyncHandler(async (req: Request, res: Response) => {
  const allUsers = await User.findAll();
  const customers = allUsers.filter(u => u.role === 'user');
  res.status(200).json(customers);
});

// @desc    Get customer by ID
// @route   GET /api/admin/customers/:id
// @access  Private/Admin
export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (customer) {
    return res.status(200).json(customer);
  } else {
    return res.status(404).json({ message: 'Khách hàng không tìm thấy' });
  }
});

// @desc    Update customer status
// @route   PUT /api/admin/customers/:id/status
// @access  Private/Admin
export const updateCustomerStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const customerIndex = customers.findIndex(c => c.id === parseInt(id));

  if (customerIndex !== -1) {
    customers[customerIndex].status = status;
    res.status(200).json({ message: 'Cập nhật trạng thái khách hàng thành công', customer: customers[customerIndex] });
  } else {
    res.status(404).json({ message: 'Khách hàng không tìm thấy' });
  }
});

// @desc    Get all support tickets
// @route   GET /api/admin/support-tickets
// @access  Private/Admin
export const getAllSupportTickets = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(supportTickets);
});

// @desc    Update support ticket status
// @route   PUT /api/admin/support-tickets/:id/status
// @access  Private/Admin
export const updateSupportTicketStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticketIndex = supportTickets.findIndex(t => t.id === parseInt(id));

  if (ticketIndex !== -1) {
    supportTickets[ticketIndex].status = status;
    res.status(200).json({ message: 'Cập nhật trạng thái phiếu hỗ trợ thành công', ticket: supportTickets[ticketIndex] });
  } else {
    res.status(404).json({ message: 'Phiếu hỗ trợ không tìm thấy' });
  }
}); 