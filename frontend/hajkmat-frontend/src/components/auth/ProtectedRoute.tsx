import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [accessDecision, setAccessDecision] = useState<boolean | null>(null);

  // Make authentication decision only once per location change or auth state change
  useEffect(() => {
    if (!loading) {
      // Only make decision once loading is complete
      const devBypassActive =
        import.meta.env.DEV && window.localStorage.getItem('dev_auth_bypass') === 'true';

      setAccessDecision(isAuthenticated || devBypassActive);
    }
  }, [isAuthenticated, loading, location.pathname]);

  // Show loading state
  if (loading || accessDecision === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return accessDecision ? <Outlet /> : <Navigate to="/" replace />;
};
