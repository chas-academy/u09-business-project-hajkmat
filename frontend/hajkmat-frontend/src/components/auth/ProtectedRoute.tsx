import { Navigate, Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const redirectAttempted = sessionStorage.getItem('redirectAttempted') === 'true';

  useEffect(() => {
    if (!loading && !isAuthenticated && !redirectAttempted) {
      sessionStorage.setItem('redirectAttempted', 'true');
    }

    // Clear the flag when user becomes authenticated
    if (isAuthenticated) {
      sessionStorage.removeItem('redirectAttempted');
    }
  }, [isAuthenticated, loading, redirectAttempted]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated) {
    if (!redirectAttempted) {
      return <Navigate to="/login" replace />;
    }

    // Show login message rather than redirecting again
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">You need to log in first.</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <Outlet />;
};
