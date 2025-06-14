import React from 'react';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useAuth } from '../../../hooks/useAuth';

const Dashboard: React.FC = () => {
  useDocumentTitle('Dashboard | Hajkmat');

  // Use the auth context instead of making a separate API call
  const { user, loading } = useAuth();

  // Get user name from the auth context
  const userName = user?.displayName || 'användare';

  if (loading) {
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
