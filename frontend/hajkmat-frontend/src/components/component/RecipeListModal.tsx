import { useState, useEffect } from 'react';
import { getRecipeList, removeRecipeFromList } from '../../services/recipeListService';
import { RecipeList } from '../../types/recipeList';
import { Recipe } from '../../types/recipe';
import Image from './Image';
import Button from './Button';

interface RecipeListModalProps {
  listId: string;
  listName: string;
  isOpen: boolean;
  onClose: () => void;
  onRecipeRemoved?: (listId: string) => void;
}

const RecipeListModal: React.FC<RecipeListModalProps> = ({
  listId,
  listName,
  isOpen,
  onClose,
  onRecipeRemoved,
}) => {
  const [recipeList, setRecipeList] = useState<RecipeList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && listId) {
      fetchRecipeList();
    }
  }, [isOpen, listId]);

  const fetchRecipeList = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getRecipeList(listId);
      setRecipeList(list);
    } catch (err) {
      console.error('Error fetching recipe list:', err);
      setError(err instanceof Error ? err.message : 'Kunde inte hämta receptlistan');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    if (!recipeList) return;

    try {
      const updatedList = await removeRecipeFromList(listId, recipeId);
      setRecipeList(updatedList);

      // Notify parent component that a recipe was removed
      if (onRecipeRemoved) {
        onRecipeRemoved(listId);
      }
    } catch (err) {
      console.error('Error removing recipe:', err);
      setError('Kunde inte ta bort receptet från listan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{listName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {recipeList && !loading && (
            <>
              {recipeList.recipes && recipeList.recipes.length > 0 ? (
                <>
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {recipeList.recipes.length} recept i denna lista
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipeList.recipes.map((recipe: Recipe) => (
                      <div
                        key={recipe._id || recipe.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border"
                      >
                        <div className="relative">
                          <Image
                            src={recipe.image}
                            alt={recipe.title}
                            objectFit="cover"
                            rounded={false}
                            aspectRatio="16/9"
                            fallbackSrc="/images/recipe-placeholder.jpg"
                            className="w-full h-48"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <h3 className="text-white font-medium line-clamp-2">{recipe.title}</h3>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex flex-wrap gap-1 mb-3">
                            {recipe.dishTypes?.slice(0, 2).map(type => (
                              <span
                                key={type}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {type}
                              </span>
                            ))}
                            {recipe.diets?.slice(0, 2).map(diet => (
                              <span
                                key={diet}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {diet}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-between text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {recipe.readyInMinutes}m
                            </span>
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              {recipe.servings}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="small"
                              className="flex-1 mt-0 mb-0 mx-0"
                              onClick={() =>
                                window.open(recipe.sourceUrl, '_blank', 'noopener,noreferrer')
                              }
                            >
                              Visa recept
                            </Button>
                            <Button
                              variant="danger"
                              size="small"
                              className="mt-0 mb-0 mx-0"
                              onClick={() =>
                                handleRemoveRecipe((recipe._id || recipe.id).toString())
                              }
                            >
                              Ta bort
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <div className="mb-4">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">Inga recept i denna lista</p>
                  <p>Lägg till recept genom att söka och spara dem till denna lista.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" size="medium" onClick={onClose} className="mt-0 mb-0 mx-0">
            Stäng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeListModal;
