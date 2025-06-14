// src/components/auth/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { handleTokenAuthentication } = useAuth();

  useEffect(() => {
    const processToken = async () => {
      // Get token from URL params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (token) {
        // Store token and process authentication
        const success = await handleTokenAuthentication(token);
        navigate(success ? '/' : '/login');
      } else {
        navigate('/login');
      }
    };

    processToken();
  }, [navigate, handleTokenAuthentication]);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-2">Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
