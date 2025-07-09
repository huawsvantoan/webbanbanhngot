import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import authService from '../services/authService';

// Layout components
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Public pages
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Checkout from '../pages/Checkout';
import Blog from '../pages/Blog';
import BlogDetail from '../pages/BlogDetail';

// Protected pages
import Profile from '../pages/Profile';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';

// Admin pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminProducts from '../pages/admin/Products';
import AdminCategories from '../pages/admin/Categories';
import AdminOrders from '../pages/admin/Orders';
import AdminOrderDetail from '../pages/admin/OrderDetail';
import AdminUsers from '../pages/admin/Users';
import AdminReviews from '../pages/admin/Reviews';
import ProductForm from '../pages/admin/ProductForm';
import AdminBlogManagement from '../pages/admin/BlogManagement';
import AdminBannerManagement from '../pages/admin/BannerManagement';
import AdminContacts from '../pages/admin/Contacts';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  console.log("AdminRoute check:", { isAuthenticated, userRole: user?.role });
  return (isAuthenticated && user?.role === 'admin') ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:orderId" element={<AdminOrderDetail />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="banners" element={<AdminBannerManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="blog" element={<AdminBlogManagement />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 