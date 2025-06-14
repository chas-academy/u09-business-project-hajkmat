import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });

        setIsAuth(response.ok);
      } catch (error) {
        console.error('Protected route auth check failed:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to home page if not authenticated
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};
