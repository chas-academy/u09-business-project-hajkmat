import { Recipe } from '../types/recipe';

/**
 * Get the appropriate ID for a recipe depending on where it's stored
 */
export const getRecipeId = (recipe: Recipe): string => {
  // If it's a MongoDB stored recipe with _id, use that
  if (recipe._id) {
    return recipe._id.toString();
  }

  // If it has externalId, use that
  if (recipe.externalId) {
    return recipe.externalId.toString();
  }

  // Otherwise use the regular id (from external API)
  return recipe.id.toString();
};

/**
 * Check if two recipes are the same
 */
export const isSameRecipe = (recipe1: Recipe, recipe2: Recipe): boolean => {
  // Compare by _id if both have it
  if (recipe1._id && recipe2._id) {
    return recipe1._id === recipe2._id;
  }

  // Compare by externalId if both have it
  if (recipe1.externalId && recipe2.externalId) {
    return recipe1.externalId === recipe2.externalId;
  }

  // Compare by regular id as fallback
  return recipe1.id === recipe2.id;
};
