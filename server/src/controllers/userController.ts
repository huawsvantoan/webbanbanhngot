import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/User';

// Mock data for demonstration purposes
let users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2023-01-01T10:00:00Z',
    last_login: '2024-06-17T15:00:00Z',
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    status: 'active',
    created_at: '2023-01-05T11:00:00Z',
    last_login: '2024-06-16T10:00:00Z',
  },
  {
    id: 3,
    name: 'Blocked User',
    email: 'blocked@example.com',
    role: 'user',
    status: 'blocked',
    created_at: '2023-02-01T12:00:00Z',
    last_login: '2024-05-01T09:00:00Z',
  },
];

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const users = await User.findAll(includeDeleted);
  return res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(404).json({ message: 'Người dùng không tìm thấy' });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const userIndex = users.findIndex(u => u.id === parseInt(id));

  if (userIndex !== -1) {
    users[userIndex].status = status;
    return res.status(200).json({ message: 'Cập nhật trạng thái người dùng thành công', user: users[userIndex] });
  } else {
    return res.status(404).json({ message: 'Người dùng không tìm thấy' });
  }
});

export const getUsers = async (req: Request, res: Response) => {
  return res.status(200).json([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'User Demo',
      email: 'user@example.com',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]);
};

// Xóa user
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const success = await User.delete(Number(id));
  if (success) {
    return res.status(200).json({ message: 'Xóa mềm người dùng thành công' });
  } else {
    return res.status(404).json({ message: 'Người dùng không tìm thấy' });
  }
});

// Đổi vai trò user
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role || (role !== 'user' && role !== 'admin')) {
    return res.status(400).json({ message: 'Vai trò không hợp lệ' });
  }
  const success = await User.update(Number(id), { role } as any);
  if (success) {
    return res.status(200).json({ message: 'Cập nhật vai trò thành công' });
  } else {
    return res.status(404).json({ message: 'Người dùng không tìm thấy' });
  }
});

export const restoreUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const success = await User.restore(Number(id));
  if (success) {
    return res.status(200).json({ message: 'Khôi phục người dùng thành công' });
  } else {
    return res.status(404).json({ message: 'Người dùng không tìm thấy hoặc chưa bị xóa' });
  }
};

export const deleteUserPermanent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const [result] = await User.deletePermanent(Number(id));
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Không tìm thấy user để xóa vĩnh viễn' });
  }
  return res.status(200).json({ message: 'User đã được xóa vĩnh viễn' });
}); 