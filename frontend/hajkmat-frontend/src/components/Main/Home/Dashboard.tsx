import React, { useEffect, useState } from 'react';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

const Dashboard: React.FC = () => {
  useDocumentTitle('Dashboard | Hajkmat');
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from API
        const response = await fetch('/api/auth/check', {
          credentials: 'include', // Important for cookies
        });

        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.user?.name || 'användare');
        } else {
          setUserName('användare');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserName('användare');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-4">Välkommen {userName}!</h1>
          <p className="text-center text-gray-600">
            Du är nu inloggad i Hajkmat. Här kan du planera dina vandringar och skapa matlistor för
            äventyr i naturen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
