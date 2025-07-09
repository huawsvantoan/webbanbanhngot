import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../config/database';

// Helper function to get date range
const getDateRange = (range: string) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0); // The beginning of time
  }
  return { startDate, endDate };
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { range = '30d' } = req.query;
  const { startDate } = getDateRange(range as string);

  // 1. Revenue
  const [revenueResult] = await pool.query<any>(
    'SELECT SUM(total_amount) as total FROM orders WHERE created_at >= ? AND status = ?',
    [startDate, 'completed']
  );
  const totalRevenue = revenueResult[0].total || 0;

  // 2. Orders
  const [ordersResult] = await pool.query<any>(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
    FROM orders WHERE created_at >= ?`,
    [startDate]
  );
  const orderStats = ordersResult[0];

  // 3. Customers
  const [customersResult] = await pool.query<any>(
    'SELECT COUNT(*) as total, SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as newThisMonth FROM users',
    [startDate]
  );
  const customerStats = customersResult[0];

  // 4. Products
  const [productsResult] = await pool.query<any>(
    `SELECT
      COUNT(*) as total,
      SUM(CASE WHEN stock <= 10 AND stock > 0 THEN 1 ELSE 0 END) as lowStock,
      SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as outOfStock
    FROM products`
  );
  const productStats = productsResult[0];

  // Mocking growth and detailed charts for now as they require more complex queries (e.g., comparing to a previous period)
  const mockGrowth = (value: number) => (Math.random() * value).toFixed(0);
  
  res.status(200).json({
    revenue: {
      total: totalRevenue,
      monthly: [],
      daily: [],
      growth: mockGrowth(20),
    },
    orders: {
      total: orderStats.total || 0,
      pending: orderStats.pending || 0,
      completed: orderStats.completed || 0,
      cancelled: orderStats.cancelled || 0,
      monthly: [],
      daily: [],
      growth: mockGrowth(15),
    },
    customers: {
      total: customerStats.total || 0,
      newThisMonth: customerStats.newThisMonth || 0,
      active: 0, // Requires a definition of "active"
      growth: mockGrowth(10),
    },
    products: {
      total: productStats.total || 0,
      lowStock: productStats.lowStock || 0,
      outOfStock: productStats.outOfStock || 0,
      topSelling: [],
    },
    categories: [],
  });
});

export const getAnalyticsHandler = asyncHandler(async (req: Request, res: Response) => {
  const { range } = req.query;

  // Mock data for analytics based on time range
  let revenueGrowth = 15;
  let ordersGrowth = 10;
  let customersGrowth = 8;

  if (range === '7d') {
    revenueGrowth = 5;
    ordersGrowth = 3;
    customersGrowth = 2;
  } else if (range === '90d') {
    revenueGrowth = 25;
    ordersGrowth = 20;
    customersGrowth = 15;
  } else if (range === '1y') {
    revenueGrowth = 50;
    ordersGrowth = 40;
    customersGrowth = 30;
  }

  const data = {
    revenue: {
      total: 125000,
      monthly: [
        { month: 'Tháng 1', amount: 10000 },
        { month: 'Tháng 2', amount: 12000 },
        { month: 'Tháng 3', amount: 15000 },
        { month: 'Tháng 4', amount: 18000 },
        { month: 'Tháng 5', amount: 20000 },
        { month: 'Tháng 6', amount: 22000 },
      ],
      daily: [], // Placeholder for daily data
      growth: revenueGrowth,
    },
    orders: {
      total: 1200,
      pending: 50,
      completed: 1000,
      cancelled: 150,
      monthly: [
        { month: 'Tháng 1', count: 100 },
        { month: 'Tháng 2', count: 120 },
        { month: 'Tháng 3', count: 150 },
        { month: 'Tháng 4', count: 180 },
        { month: 'Tháng 5', count: 200 },
        { month: 'Tháng 6', count: 220 },
      ],
      daily: [], // Placeholder for daily data
      growth: ordersGrowth,
    },
    customers: {
      total: 500,
      newThisMonth: 30,
      active: 450,
      growth: customersGrowth,
    },
    products: {
      total: 250,
      lowStock: 15,
      outOfStock: 5,
      topSelling: [
        { id: 1, name: 'Bánh Kem Dâu', sales: 120, revenue: 1200 },
        { id: 2, name: 'Bánh Mì Ngọt', sales: 90, revenue: 450 },
        { id: 3, name: 'Bánh Tart Trứng', sales: 75, revenue: 600 },
      ],
    },
    categories: [
      { name: 'Bánh kem', count: 50, revenue: 50000 },
      { name: 'Bánh mì', count: 80, revenue: 25000 },
      { name: 'Bánh ngọt', count: 120, revenue: 35000 },
    ],
  };

  return res.status(200).json(data);
}); 