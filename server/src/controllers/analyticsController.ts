import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { pool } from '../config/database';

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalyticsData = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { range = '6months' } = req.query;
    
    let dateFilter = '';
    switch (range) {
      case '7days':
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
        break;
      case '30days':
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
        break;
      case '3months':
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)';
        break;
      case '6months':
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)';
        break;
      case '1year':
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)';
        break;
      default:
        dateFilter = 'AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)';
    }

    // Get monthly revenue
    const [monthlyRevenueResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total_amount) as amount
      FROM orders 
      WHERE status IN ("delivered", "completed") 
        ${dateFilter}
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);
    const monthlyRevenue = (monthlyRevenueResult as any).map((item: any) => ({
      month: new Date(item.month + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      amount: parseFloat(item.amount)
    }));

    // Get order status distribution
    const [orderStatusResult] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders 
      WHERE 1=1 ${dateFilter}
      GROUP BY status
    `);
    const orderStatusDistribution = (orderStatusResult as any).reduce((acc: any, item: any) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

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
        ${dateFilter.replace('created_at', 'o.created_at')}
      GROUP BY p.id, p.name, p.price
      ORDER BY total_sold DESC
      LIMIT 10
    `);
    const topProducts = (topProductsResult as any).map((product: any) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      total_sold: parseInt(product.total_sold)
    }));

    // Get top categories
    const [topCategoriesResult] = await pool.execute(`
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as product_count,
        COALESCE(SUM(oi.quantity), 0) as total_sales
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.isDeleted = 0
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ("delivered", "completed")
      WHERE c.isDeleted = 0
        ${dateFilter.replace('created_at', 'o.created_at')}
      GROUP BY c.id, c.name
      ORDER BY total_sales DESC
      LIMIT 10
    `);
    const topCategories = (topCategoriesResult as any).map((category: any) => ({
      id: category.id,
      name: category.name,
      product_count: parseInt(category.product_count),
      total_sales: parseInt(category.total_sales)
    }));

    // Get customer growth
    const [customerGrowthResult] = await pool.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM users 
      WHERE role = "user" 
        ${dateFilter}
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);
    const customerGrowth = (customerGrowthResult as any).map((item: any) => ({
      month: new Date(item.month + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      count: parseInt(item.count)
    }));

    // Get revenue by day (last 30 days)
    const [revenueByDayResult] = await pool.execute(`
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as amount
      FROM orders 
      WHERE status IN ("delivered", "completed") 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    const revenueByDay = (revenueByDayResult as any).map((item: any) => ({
      date: item.date,
      amount: parseFloat(item.amount)
    }));

    const analyticsData = {
      monthlyRevenue,
      orderStatusDistribution,
      topProducts,
      topCategories,
      customerGrowth,
      revenueByDay
    };

    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics data error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}); 