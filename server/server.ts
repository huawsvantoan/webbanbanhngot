import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './src/routes/auth';
import productRoutes from './src/routes/products';
import cartRoutes from './src/routes/cart';
import orderRoutes from './src/routes/orders';
import categoryRoutes from './src/routes/categories';
import reviewRoutes from './src/routes/reviews';
import adminOrdersRoutes from './src/routes/adminOrders';
import adminReviewsRoutes from './src/routes/adminReviews';
import bannersRoutes from './src/routes/banners';
import dashboardRoutes from './src/routes/dashboard';
import blogRoutes from './src/routes/blog';
import usersRoutes from './src/routes/users';
import analyticsRoutes from './src/routes/analytics';
import contactsRoutes from './src/routes/contacts';
import uploadRoutes from './src/routes/upload';
import paymentRoutes from './src/routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global request logger - ADDED FOR DEBUGGING
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminOrdersRoutes);
app.use('/api/admin', adminReviewsRoutes);
app.use('/api/admin', bannersRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin/blog', blogRoutes);
app.use('/api/admin/users', usersRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 