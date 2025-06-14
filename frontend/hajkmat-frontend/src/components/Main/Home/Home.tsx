import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../component/Button';

const Home = () => {
  useDocumentTitle('Matplaneraren');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated via session cookie
    const checkAuth = async () => {
      try {
        // In development, you can bypass the real authentication check
        if (import.meta.env.DEV && !window.localStorage.getItem('dev_auth_bypass')) {
          console.log('Development mode: Skipping real authentication check');
          return;
        }

        const response = await fetch('/api/auth/check', {
          credentials: 'include', // Important for cookies
        });
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          navigate('/dashboard');
        }
        // 401 responses are expected when not logged in - no need to handle them
      } catch (error) {
        // Only log actual network errors, not authentication errors
        console.error('Authentication check failed (network error):', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // This will redirect the browser to Google's auth page
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Välkommen till Hajkmat</h1>

        <div className="mb-8 text-gray-700">
          <p className="mb-4">
            Planera dina vandringar och äventyr med smarta matplaneringsverktyg. Hajkmat hjälper dig
            att enkelt planera mat för dina utflykter i naturen.
          </p>
          <p>Skapa konton, spara dina favoritrecept. Kom igång genom att logga in nedan!</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-6">Logga in för att komma igång</h2>

          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              variant="primary"
              size="medium"
            >
              <div className="flex items-center justify-center w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Fortsätt med Google
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
