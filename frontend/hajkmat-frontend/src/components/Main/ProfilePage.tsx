import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import API_URL from '../../config/api';
import RecipeListSection from '../component/RecipeListSection';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    console.log('Current API_URL:', API_URL);
    console.log('Delete account endpoint:', `${API_URL}/auth/delete-account`);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      console.log('Trying primary delete route...');
      let response = await fetch(`${API_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      // If main route fails, try the alternative
      if (response.status === 404) {
        console.log('Primary route failed, trying alternative...');
        response = await fetch(`${API_URL}/auth/delete-account-alt`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      await logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Profile Picture */}
          <div className="mb-4 md:mb-0 md:mr-8">
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl border-4 border-blue-500">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user.displayName || 'User'}</h1>
            <p className="text-gray-600 mb-4">{user.email || 'No email provided'}</p>

            {/* Account Actions */}
            <div className="mt-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      </div>

      {/* Recipe List Section */}
      <div className="mb-8">
        <RecipeListSection />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Account</h3>
            <p className="mb-6">
              Är du säker på att du vill radera ditt konto? Denna åtgärd kan inte ångras och all din
              data kommer att tas bort permanent.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition duration-200"
              >
                Avbryt
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Radera konto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
