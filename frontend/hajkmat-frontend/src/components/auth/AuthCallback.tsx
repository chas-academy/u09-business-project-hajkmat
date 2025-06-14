import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleTokenAuthentication } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processToken = async () => {
      try {
        console.log('AuthCallback mounted, URL:', window.location.href);

        // Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        console.log('Token from URL:', token ? 'Found token' : 'No token found');

        if (!token) {
          setError('No authentication token found in URL');
          return;
        }

        // Explicitly store in localStorage first
        localStorage.setItem('auth_token', token);
        console.log('Token stored in localStorage:', !!localStorage.getItem('auth_token'));

        // Process token in auth context
        const success = await handleTokenAuthentication(token);
        console.log('Auth result:', success ? 'Success' : 'Failed');

        // Navigate based on result
        navigate(success ? '/' : '/login?error=auth_failed');
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('Authentication process failed');
        navigate('/login?error=exception');
      }
    };

    processToken();
  }, [navigate, handleTokenAuthentication]);

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-2">Processing login...</p>
    </div>
  );
};

export default AuthCallback;
