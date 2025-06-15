import { Request, Response } from 'express';
import RecipeList from '../models/recipeList';

// Create a new recipe list
export const createRecipeList = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = (req.user as any).id;

  try {
    const newList = new RecipeList({ name, user: userId });
    await newList.save();
    res.status(201).json(newList);
  } catch (error: unknown) {
    console.error('Failed to create recipe list:', error);
    res.status(500).json({ error: 'Failed to create recipe list' });
  }
};

// Get all recipe lists for a user
export const getRecipeLists = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = (req.user as any).id;

  try {
    const lists = await RecipeList.find({ user: userId });
    res.status(200).json(lists);
  } catch (error: unknown) {
    console.error('Failed to retrieve recipe lists:', error);
    res.status(500).json({ error: 'Failed to retrieve recipe lists' });
  }
};

// Update a recipe list
export const updateRecipeList = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = (req.user as any).id;

  try {
    // Find the recipe list and ensure it belongs to the current user
    const recipeList = await RecipeList.findOne({ _id: id, user: userId });

    if (!recipeList) {
      res.status(404).json({ error: 'Recipe list not found' });
      return;
    }

    // Update using set method instead of direct property assignment
    recipeList.set('name', name);

    // Save changes
    await recipeList.save();

    res.status(200).json(recipeList);
  } catch (error: unknown) {
    console.error('Failed to update recipe list:', error);
    res.status(500).json({ error: 'Failed to update recipe list' });
  }
};

// Delete a recipe list
export const deleteRecipeList = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = (req.user as any).id;

  try {
    const list = await RecipeList.findOneAndDelete({ _id: id, user: userId });
    if (!list) {
      res.status(404).json({ error: 'Recipe list not found' });
      return;
    }
    res.status(200).json({ message: 'Recipe list deleted successfully' });
  } catch (error: unknown) {
    console.error('Failed to delete recipe list:', error);
    res.status(500).json({ error: 'Failed to delete recipe list' });
  }
};
