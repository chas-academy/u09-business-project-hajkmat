import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // Debug what's happening
  console.log('ProtectedRoute state:', { isAuthenticated, loading });

  // For development bypass: check localStorage directly as a fallback
  const devBypassActive = import.meta.env.DEV && window.localStorage.getItem('dev_auth_bypass');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow access if authenticated through context OR dev bypass is active
  const allowAccess = isAuthenticated || devBypassActive;

  console.log('ProtectedRoute access decision:', {
    allowAccess,
    isAuthenticated,
    devBypassActive,
  });

  return allowAccess ? <Outlet /> : <Navigate to="/" />;
};
