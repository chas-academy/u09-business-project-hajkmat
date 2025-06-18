import { useState, useEffect } from 'react';
import Button from '../../component/Button';
import Image from '../../component/Image';
import Checkbox from '../../formcomponents/Checkbox';
import TextInput from '../../formcomponents/TextInput';
import { useAuth } from '../../../hooks/useAuth';
import { addRecipeToList, removeRecipeFromList } from '../../../services/recipeListService';
import { Recipe } from '../../../types/recipe';
import { RecipeList } from '../../../types/recipeList';
import API_URL from '../../../config/api';

interface FilterOptions {
  [key: string]: boolean;
}

const RecipeSearch = () => {
  // Recipe state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [query, setQuery] = useState<string>('');
  const [queryError, setQueryError] = useState<string>('');
  const [selectedCuisines, setSelectedCuisines] = useState<FilterOptions>({});
  const [selectedDiets, setSelectedDiets] = useState<FilterOptions>({});
  const [selectedMealTypes, setSelectedMealTypes] = useState<FilterOptions>({});

  // Pagination
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // Recipe lists state
  const [recipeLists, setRecipeLists] = useState<RecipeList[]>([]);
  const [showListModal, setShowListModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [newListName, setNewListName] = useState('');
  const [listNameError, setListNameError] = useState('');

  const { user, isAuthenticated } = useAuth();

  // API key from environment variables
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

  // Available options for filters
  const cuisineOptions = [
    { id: 'italian', label: 'Italiensk' },
    { id: 'mexican', label: 'Mexikansk' },
    { id: 'indian', label: 'Indisk' },
    { id: 'thai', label: 'Thailändsk' },
    { id: 'chinese', label: 'Kinesisk' },
    { id: 'japanese', label: 'Japansk' },
    { id: 'french', label: 'Fransk' },
    { id: 'mediterranean', label: 'Medelhavsmat' },
  ];

  const dietOptions = [
    { id: 'vegetarian', label: 'Vegetarisk' },
    { id: 'vegan', label: 'Vegansk' },
    { id: 'gluten-free', label: 'Glutenfri' },
    { id: 'ketogenic', label: 'Ketogen' },
    { id: 'pescetarian', label: 'Pescetarian' },
    { id: 'paleo', label: 'Paleo' },
  ];

  const mealTypeOptions = [
    { id: 'main course', label: 'Huvudrätt' },
    { id: 'side dish', label: 'Sidorätt' },
    { id: 'dessert', label: 'Efterrätt' },
    { id: 'appetizer', label: 'Förrätt' },
    { id: 'salad', label: 'Sallad' },
    { id: 'bread', label: 'Bröd' },
    { id: 'breakfast', label: 'Frukost' },
    { id: 'soup', label: 'Soppa' },
    { id: 'beverage', label: 'Dryck' },
  ];

  // Fetch user's recipe lists
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserLists();
    }
  }, [isAuthenticated, user]);

  const fetchUserLists = async () => {
    try {
      const response = await fetch(`${API_URL}/recipe-lists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipe lists');
      }

      const data = await response.json();
      setRecipeLists(data.lists || []);
    } catch (err) {
      console.error('Error fetching recipe lists:', err);
    }
  };

  // Update filter state handlers
  const handleCuisineChange = (cuisine: string, isChecked: boolean) => {
    setSelectedCuisines(prev => ({
      ...prev,
      [cuisine]: isChecked,
    }));
  };

  const handleDietChange = (diet: string, isChecked: boolean) => {
    setSelectedDiets(prev => ({
      ...prev,
      [diet]: isChecked,
    }));
  };

  const handleMealTypeChange = (mealType: string, isChecked: boolean) => {
    setSelectedMealTypes(prev => ({
      ...prev,
      [mealType]: isChecked,
    }));
  };

  const searchRecipes = async (resetOffset = true) => {
    // Validate search
    if (
      query.trim() === '' &&
      Object.keys(selectedCuisines).filter(k => selectedCuisines[k]).length === 0 &&
      Object.keys(selectedDiets).filter(k => selectedDiets[k]).length === 0 &&
      Object.keys(selectedMealTypes).filter(k => selectedMealTypes[k]).length === 0
    ) {
      setQueryError('Ange sökord eller välj minst ett filter');
      return;
    }

    setQueryError('');

    if (resetOffset) {
      setOffset(0);
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
      url.searchParams.append('apiKey', API_KEY || '');
      url.searchParams.append('addRecipeInformation', 'true');
      url.searchParams.append('number', limit.toString());
      url.searchParams.append('offset', resetOffset ? '0' : offset.toString());

      if (query) url.searchParams.append('query', query);

      // Add selected cuisines to query
      const cuisines = Object.keys(selectedCuisines).filter(key => selectedCuisines[key]);
      if (cuisines.length > 0) {
        url.searchParams.append('cuisine', cuisines.join(','));
      }

      // Add selected diets to query
      const diets = Object.keys(selectedDiets).filter(key => selectedDiets[key]);
      if (diets.length > 0) {
        url.searchParams.append('diet', diets.join(','));
      }

      // Add selected meal types to query
      const mealTypes = Object.keys(selectedMealTypes).filter(key => selectedMealTypes[key]);
      if (mealTypes.length > 0) {
        url.searchParams.append('type', mealTypes.join(','));
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();

      if (resetOffset) {
        setRecipes(data.results);
      } else {
        setRecipes(prev => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Kunde inte hämta recept. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial recipes on component mount
  useEffect(() => {
    searchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRecipes();
  };

  const loadMore = () => {
    setOffset(prev => prev + limit);
    searchRecipes(false);
  };

  const openAddToListModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowListModal(true);
  };

  const closeModal = () => {
    setShowListModal(false);
    setSelectedRecipe(null);
    setNewListName('');
    setListNameError('');
  };

  const addToList = async (listId: string) => {
    if (!selectedRecipe) return;

    try {
      const updatedList = await addRecipeToList(listId, selectedRecipe);

      // Update local state with the complete updated list returned from backend
      setRecipeLists(prev =>
        prev.map(list => (list.id === listId || list._id === listId ? updatedList : list)),
      );

      closeModal();
      // Show success notification
      alert(`Lade till "${selectedRecipe.title}" i listan`);
    } catch (err) {
      console.error('Error adding recipe to list:', err);
      alert('Kunde inte lägga till receptet i listan');
    }
  };

  const handleRemoveRecipe = async (
    recipeId: string,
    listId: string | undefined,
  ): Promise<void> => {
    if (!listId) {
      console.error('Cannot remove recipe: Missing list ID');
      return;
    }
    try {
      const updatedList = await removeRecipeFromList(listId, recipeId);

      setRecipeLists(prev => prev.map(list => (list.id === listId ? updatedList : list)));
    } catch (err) {
      console.error('Error removing recipe:', err);
      alert('Kunde inte ta bort receptet från listan');
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) {
      setListNameError('Ange ett namn för din lista');
      return;
    }

    if (!selectedRecipe) return;

    try {
      // This would be your actual API call to create a new list
      const response = await fetch(`${API_URL}/recipe-lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          name: newListName,
          recipes: [selectedRecipe],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create new list');
      }

      const data = await response.json();

      // Update local state with the new list
      setRecipeLists(prev => [...prev, data.list]);

      closeModal();
      // Show success notification
      alert(`Skapade ny lista "${newListName}" med recept`);
    } catch (err) {
      console.error('Error creating new list:', err);
      alert('Kunde inte skapa ny lista');
    }
  };

  const findRecipeList = (recipe: Recipe): { inList: boolean; listId: string } => {
    for (const list of recipeLists) {
      const isInList = list.recipes?.some(
        (listRecipe: Recipe) =>
          (recipe.id && listRecipe.id === recipe.id) ||
          (recipe._id && listRecipe._id === recipe._id) ||
          (recipe.id && listRecipe.externalId === recipe.id),
      );

      if (isInList) {
        return { inList: true, listId: list._id };
      }
    }
    return { inList: false, listId: '' }; // Return empty string as fallback
  };

  return (
    <div className="w-full">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        {/* Using TextInput component for search */}
        <TextInput
          id="recipe-search"
          label="Sök recept"
          value={query}
          onChange={setQuery}
          placeholder="Sök efter maträtter, ingredienser eller kök..."
          error={queryError}
          className="my-2 mx-0"
        />

        {/* Filter sections using checkboxes */}
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Välj kök</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2">
            {cuisineOptions.map(cuisine => (
              <Checkbox
                key={cuisine.id}
                id={`cuisine-${cuisine.id}`}
                label={cuisine.label}
                checked={selectedCuisines[cuisine.id] || false}
                onChange={isChecked => handleCuisineChange(cuisine.id, isChecked)}
                className="my-1 mx-0"
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Kostpreferenser</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2">
            {dietOptions.map(diet => (
              <Checkbox
                key={diet.id}
                id={`diet-${diet.id}`}
                label={diet.label}
                checked={selectedDiets[diet.id] || false}
                onChange={isChecked => handleDietChange(diet.id, isChecked)}
                className="my-1 mx-0"
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2">Måltidstyp</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2">
            {mealTypeOptions.map(mealType => (
              <Checkbox
                key={mealType.id}
                id={`meal-${mealType.id}`}
                label={mealType.label}
                checked={selectedMealTypes[mealType.id] || false}
                onChange={isChecked => handleMealTypeChange(mealType.id, isChecked)}
                className="my-1 mx-0"
              />
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" size="medium" className="mt-4 mx-0">
          Sök recept
        </Button>
      </form>

      {/* Error Message */}
      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {/* Selected filters summary */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(selectedCuisines)
          .filter(key => selectedCuisines[key])
          .map(cuisine => (
            <span
              key={cuisine}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
            >
              {cuisineOptions.find(opt => opt.id === cuisine)?.label}
              <button
                onClick={() => handleCuisineChange(cuisine, false)}
                className="ml-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        {Object.keys(selectedDiets)
          .filter(key => selectedDiets[key])
          .map(diet => (
            <span
              key={diet}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center"
            >
              {dietOptions.find(opt => opt.id === diet)?.label}
              <button
                onClick={() => handleDietChange(diet, false)}
                className="ml-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        {Object.keys(selectedMealTypes)
          .filter(key => selectedMealTypes[key])
          .map(mealType => (
            <span
              key={mealType}
              className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center"
            >
              {mealTypeOptions.find(opt => opt.id === mealType)?.label}
              <button
                onClick={() => handleMealTypeChange(mealType, false)}
                className="ml-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Image
                src={recipe.image}
                alt={recipe.title}
                objectFit="cover"
                rounded="md"
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
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {recipe.readyInMinutes}m
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  {recipe.servings}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="small"
                  className="flex-1 mt-0 mb-0 mx-0"
                  onClick={() => window.open(recipe.sourceUrl, '_blank', 'noopener,noreferrer')}
                >
                  Visa recept
                </Button>

                {isAuthenticated &&
                  (() => {
                    // Check if recipe is in any list
                    const { inList, listId } = findRecipeList(recipe);

                    return inList && listId ? (
                      // If already in a list, show Remove button
                      <Button
                        variant="danger"
                        size="small"
                        className="mt-0 mb-0 mx-0"
                        onClick={() => handleRemoveRecipe(recipe.id.toString(), listId)}
                      >
                        Ta bort
                      </Button>
                    ) : (
                      // If not in any list, show Save button
                      <Button
                        variant="secondary"
                        size="small"
                        className="mt-0 mb-0 mx-0"
                        onClick={() => openAddToListModal(recipe)}
                      >
                        Spara
                      </Button>
                    );
                  })()}

                {!isAuthenticated && (
                  <Button
                    variant="secondary"
                    size="small"
                    className="mt-0 mb-0 mx-0"
                    onClick={() => openAddToListModal(recipe)}
                    disabled={true}
                  >
                    Spara
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator at bottom */}
      {loading && (
        <div className="text-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-gray-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Load more button */}
      {!loading && recipes.length > 0 && (
        <div className="text-center mt-8 mb-4">
          <Button variant="secondary" size="medium" onClick={loadMore} className="mt-0 mb-0">
            Ladda fler recept
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          Inga recept hittades. Försök justera dina sökfilter.
        </div>
      )}

      {/* Add to List Modal */}
      {showListModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Spara recept</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
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

            {/* Image in modal */}
            <div className="mb-4">
              <Image
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                rounded="md"
                aspectRatio="16/9"
                objectFit="cover"
                className="w-full h-40"
              />
              <p className="mt-2 font-medium text-gray-800">{selectedRecipe.title}</p>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lägg till i befintlig lista:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recipeLists.length > 0 ? (
                  recipeLists.map(list => (
                    <button
                      key={list.id}
                      onClick={() => addToList(list._id)}
                      className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <span>{list.name}</span>
                      <span className="text-gray-500 text-sm">
                        {list.recipes?.length || 0} recept
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Du har inga listor än. Skapa en nedan.</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              {/* Using TextInput component for creating a new list */}
              <TextInput
                id="new-list-name"
                label="Skapa ny lista"
                value={newListName}
                onChange={setNewListName}
                placeholder="Namn på ny lista"
                error={listNameError}
                className="my-0 mx-0 mb-2"
              />

              <Button
                variant="primary"
                size="small"
                onClick={createNewList}
                disabled={!newListName.trim()}
                className="mt-0 mb-0 mx-0 ml-auto block"
              >
                Skapa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
