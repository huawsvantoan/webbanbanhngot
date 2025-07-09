import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { logout } from '../features/auth/authSlice';
import { RootState } from '../store';
import { Icons } from '../components/icons';

const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: Icons.TrendingUp },
    { path: '/admin/analytics', label: 'Analytics', icon: Icons.BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Icons.Package },
    { path: '/admin/categories', label: 'Categories', icon: Icons.FolderOpen },
    { path: '/admin/orders', label: 'Orders', icon: Icons.ShoppingCart },
    { path: '/admin/users', label: 'Users', icon: Icons.User },
    { path: '/admin/reviews', label: 'Reviews', icon: Icons.MessageSquare },
    { path: '/admin/banners', label: 'Banners', icon: Icons.Gift },
    { path: '/admin/blog', label: 'Blog', icon: Icons.MessageSquare },
    { path: '/admin/contacts', label: 'Contacts', icon: Icons.Mail },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-pink-600">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.full_name || user?.username || user?.email}
          </p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3" size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <Icons.ArrowLeft className="mr-3" size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 