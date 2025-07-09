import express from 'express';
import cors from 'cors';
import cartRoutes from './src/routes/cart';
import reviewRoutes from './src/routes/reviews';
import categoryRoutes from './src/routes/categories';
import authRoutes from './src/routes/auth';
import productRoutes from './src/routes/products';
import orderRoutes from './src/routes/orders';
import bannerRoutes from './src/routes/banners';
import blogRoutes from './src/routes/blog';
import dashboardRoutes from './src/routes/dashboard';
import analyticsRoutes from './src/routes/analytics';
import adminOrderRoutes from './src/routes/adminOrders';
import adminReviewsRoutes from './src/routes/adminReviews';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);
app.use('/api', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', bannerRoutes);
app.use('/api/admin', blogRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/admin', analyticsRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/admin', adminReviewsRoutes);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app; 