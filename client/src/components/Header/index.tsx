import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { logout } from '../../features/auth/authSlice';
import { RootState } from '../../store';
import authService from '../../services/authService';
import { Icons } from '../icons';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const CartIconRef = React.createRef<HTMLAnchorElement>();

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { items } = useAppSelector((state: RootState) => state.cart);
  const isAuthenticated = authService.isAuthenticated();
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-gray-700 hover:text-pink-600 transition-colors duration-200 py-2 px-3 ${isActive ? 'font-bold text-pink-600 border-b-2 border-pink-600' : ''}`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 py-2 text-sm text-gray-600 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>+84 395 107 987</span>
            <span>info@cakeshop.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Điểm đến mua sắm trực tuyến nhanh nhất thế giới</span>
            {/* Additional top bar items like Help, Track Order, English, USD can go here */}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center text-3xl font-extrabold text-pink-600">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxExCqo5TnMWefH0bIRyXVriXIcyV7-T1NCQ&s" alt="Cake Shop Logo" className="h-12 mr-3" />
          Cake Shop
        </Link>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClasses}>
            Trang Chủ
          </NavLink>
          <NavLink to="/products" className={navLinkClasses}>
            Sản Phẩm
          </NavLink>
          <NavLink to="/blog" className={navLinkClasses}>
            Bài Viết
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            Giới Thiệu
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Liên Hệ
          </NavLink>
        </div>

        {/* Right Section - Icons and Auth */}
        <div className="flex items-center space-x-6 relative">
          {/* Search Icon & Input */}
          <div className="relative">
            <button
              className="text-gray-700 hover:text-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              onClick={() => setShowSearch((prev) => !prev)}
              aria-label="Tìm kiếm sản phẩm"
            >
              <Icons.Search size={24} />
            </button>
            {showSearch && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg flex z-50"
                style={{ minWidth: 200 }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="px-3 py-1 outline-none w-full"
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                />
                <button type="submit" className="px-3 text-pink-600 font-bold">Go</button>
              </form>
            )}
          </div>

          {/* Cart Icon */}
          <NavLink
            to="/cart"
            ref={CartIconRef}
            className="text-gray-700 hover:text-pink-600 relative focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          >
            <Icons.ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </NavLink>

          {/* User Icon / Auth Buttons */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="text-gray-700 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                <Icons.User size={24} />
              </button>
              <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tài khoản</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đơn hàng của tôi</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <NavLink to="/login" className="text-gray-700 hover:text-pink-600 font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                Login
              </NavLink>
              <NavLink to="/register" className="bg-pink-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-pink-700 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
                Register
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Button (Hamburger) */}
          <button className="lg:hidden text-gray-700 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50">
            <Icons.Menu size={24} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 