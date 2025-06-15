import { Router } from 'express';
import {
  createRecipeList,
  getRecipeLists,
  updateRecipeList,
  deleteRecipeList,
} from '../controllers/recipeListControllers';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create a new recipe list
router.post('/', authenticate, createRecipeList);

// Get all recipe lists for the authenticated user
router.get('/', authenticate, getRecipeLists);

// Update recipe list
router.put('/:id', authenticate, updateRecipeList);

// Delete a recipe list by ID
router.delete('/:id', authenticate, deleteRecipeList);

export default router;
