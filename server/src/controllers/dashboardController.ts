import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../config/database';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Admin
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Get total orders
    const [totalOrdersResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM orders'
    );
    const totalOrders = (totalOrdersResult as any)[0].total;

    // Get pending orders
    const [pendingOrdersResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM orders WHERE status IN ("pending", "processing")'
    );
    const pendingOrders = (pendingOrdersResult as any)[0].total;

    // Get total products
    const [totalProductsResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE isDeleted = 0'
    );
    const totalProducts = (totalProductsResult as any)[0].total;

    // Get total users (customers)
    const [totalUsersResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM users WHERE role = "user"'
    );
    const totalUsers = (totalUsersResult as any)[0].total;

    // Get total revenue
    const [totalRevenueResult] = await pool.execute(
      'SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status IN ("delivered", "completed")'
    );
    const totalRevenue = (totalRevenueResult as any)[0].total;

    // Get monthly revenue for last 6 months
    const [monthlyRevenueResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total_amount) as amount
      FROM orders 
      WHERE status IN ("delivered", "completed") 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 6
    `);
    const monthlyRevenue = (monthlyRevenueResult as any).map((item: any) => ({
      month: new Date(item.month + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      amount: parseFloat(item.amount)
    }));

    // Get recent orders
    const [recentOrdersResult] = await pool.execute(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.full_name as customer_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    const recentOrders = (recentOrdersResult as any).map((order: any) => ({
      id: order.id,
      customer: order.customer_name || 'Khách hàng',
      total_amount: parseFloat(order.total_amount),
      status: order.status,
      created_at: order.created_at
    }));

    // Get top selling products
    const [topProductsResult] = await pool.execute(`
      SELECT 
        p.id,
        p.name,
        p.price,
        COALESCE(SUM(oi.quantity), 0) as total_sold
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id
      WHERE p.isDeleted = 0 
        AND (o.status IN ("delivered", "completed") OR o.status IS NULL)
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    const topProducts = (topProductsResult as any).map((product: any) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      total_sold: parseInt(product.total_sold)
    }));

    // Get order status distribution
    const [orderStatusResult] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders 
      GROUP BY status
    `);
    const orderStatusDistribution = (orderStatusResult as any).reduce((acc: any, item: any) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    // Get today's stats
    const [todayStatsResult] = await pool.execute(`
      SELECT 
        COUNT(*) as orders_today,
        COALESCE(SUM(total_amount), 0) as revenue_today
      FROM orders 
      WHERE DATE(created_at) = CURDATE()
    `);
    const todayStats = (todayStatsResult as any)[0];

    const stats = {
      totalOrders: parseInt(totalOrders),
      pendingOrders: parseInt(pendingOrders),
      totalProducts: parseInt(totalProducts),
      totalUsers: parseInt(totalUsers),
      totalRevenue: parseFloat(totalRevenue),
      monthlyRevenue,
      recentOrders,
      topProducts,
      orderStatusDistribution,
      todayStats: {
        orders: parseInt(todayStats.orders_today),
        revenue: parseFloat(todayStats.revenue_today)
      }
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}); 