import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';

interface RecipeList {
  _id: string;
  name: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const RecipeListSection: React.FC = () => {
  const [recipeLists, setRecipeLists] = useState<RecipeList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Fetch recipe lists
  useEffect(() => {
    const fetchRecipeLists = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');

        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/recipe-lists`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipe lists');
        }

        const data = await response.json();
        setRecipeLists(data);
      } catch (err) {
        console.error('Error fetching recipe lists:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recipe lists');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeLists();
  }, []);

  // Create new recipe list
  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      setIsCreating(true);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(`${API_URL}/recipe-lists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newListName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe list');
      }

      const newList = await response.json();
      setRecipeLists([...recipeLists, newList]);
      setNewListName('');
    } catch (err) {
      console.error('Error creating recipe list:', err);
      setError(err instanceof Error ? err.message : 'Failed to create recipe list');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete recipe list
  const handleDeleteList = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna receptsamling?')) return;

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await fetch(`${API_URL}/recipe-lists/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe list');
      }

      setRecipeLists(recipeLists.filter(list => list._id !== id));
    } catch (err) {
      console.error('Error deleting recipe list:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete recipe list');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Mina receptlistor</h2>

      {/* Create new list form */}
      <form onSubmit={handleCreateList} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            placeholder="Ny receptlista..."
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCreating}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isCreating || !newListName.trim()}
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Skapa'
            )}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Recipe lists */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : recipeLists.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Du har inte skapat några receptlistor än.</p>
          <p className="mt-2">Skapa din första lista med formuläret ovan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipeLists.map(list => (
            <div
              key={list._id}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-lg">{list.name}</h3>
                <p className="text-sm text-gray-500">
                  Skapad {new Date(list.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/recipe-lists/${list._id}`)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors"
                >
                  Visa
                </button>
                <button
                  onClick={() => handleDeleteList(list._id)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeListSection;
