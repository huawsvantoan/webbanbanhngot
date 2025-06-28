import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  // Mock data for dashboard stats
  const stats = {
    totalRevenue: 125000,
    totalOrders: 1200,
    totalProducts: 250,
    totalCustomers: 500,
    monthlyRevenue: [
      { month: 'Tháng 1', amount: 10000 },
      { month: 'Tháng 2', amount: 12000 },
      { month: 'Tháng 3', amount: 15000 },
      { month: 'Tháng 4', amount: 18000 },
      { month: 'Tháng 5', amount: 20000 },
      { month: 'Tháng 6', amount: 22000 },
    ],
    recentOrders: [
      { id: 101, customer: 'Nguyễn Văn A', amount: 150, status: 'Đang xử lý' },
      { id: 102, customer: 'Trần Thị B', amount: 200, status: 'Đã giao' },
      { id: 103, customer: 'Lê Văn C', amount: 75, status: 'Đang chờ' },
    ],
    topSellingProducts: [
      { id: 1, name: 'Bánh Kem Dâu', sales: 120 },
      { id: 2, name: 'Bánh Mì Ngọt', sales: 90 },
      { id: 3, name: 'Bánh Tart Trứng', sales: 75 },
    ],
  };

  return res.status(200).json(stats);
}); 