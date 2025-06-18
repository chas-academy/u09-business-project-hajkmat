// services/recipeListService.ts
import { Recipe } from '../types/recipe';
import { RecipeList } from '../types/recipeList';
import API_URL from '../config/api';

/**
 * Add a recipe to a list
 */
export const addRecipeToList = async (listId: string, recipe: Recipe): Promise<RecipeList> => {
  try {
    const response = await fetch(`${API_URL}/recipe-lists/${listId}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({ recipe }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add recipe');
    }

    const data = await response.json();
    return data.list; // Note: Backend now returns data.list, not data.list.recipes
  } catch (err) {
    console.error('Error adding recipe to list:', err);
    throw err;
  }
};

/**
 * Remove a recipe from a list
 */
export const removeRecipeFromList = async (
  listId: string,
  recipeId: string,
): Promise<RecipeList> => {
  try {
    const response = await fetch(`${API_URL}/recipe-lists/${listId}/recipes/${recipeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove recipe');
    }

    const data = await response.json();
    return data.list; // Note: Backend now returns data.list directly
  } catch (err) {
    console.error('Error removing recipe from list:', err);
    throw err;
  }
};
