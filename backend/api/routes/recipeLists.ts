import express from 'express';
import {
  createRecipeList,
  getRecipeLists,
  updateRecipeList,
  deleteRecipeList,
  addRecipeToList,
  removeRecipeFromList,
  getRecipeListById,
} from '../controllers/recipeListControllers';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create a new recipe list
router.post('/', authenticate, createRecipeList);

// Get all recipe lists for the authenticated user
router.get('/', authenticate, getRecipeLists);

// Get a single recipe list by ID (with recipes populated)
router.get('/:id', authenticate, getRecipeListById);

// Update recipe list
router.put('/:id', authenticate, updateRecipeList);

// Delete a recipe list by ID
router.delete('/:id', authenticate, deleteRecipeList);

// Add a recipe to a list by ID
router.post('/:id/recipes', authenticate, addRecipeToList);

// Delete a recipe from a list by ID
router.delete('/:listId/recipes/:recipeId', authenticate, removeRecipeFromList);

export default router;
