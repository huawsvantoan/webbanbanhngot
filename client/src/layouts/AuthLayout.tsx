import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthLayout: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Cake Shop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to your account or create a new one
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout; 