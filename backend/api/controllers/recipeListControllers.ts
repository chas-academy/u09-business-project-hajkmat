import { Request, Response } from 'express';
import { Types } from 'mongoose';
import RecipeList from '../models/recipeList';
import Recipe, { IRecipeDocument } from '../models/recipe';

// Create a new recipe list
export const createRecipeList = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = req.user?._id || req.user?.id;

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

  const userId = req.user?._id || req.user?.id;

  try {
    const lists = await RecipeList.find({ userId: userId });
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

  const userId = req.user?._id || req.user?.id;

  try {
    const recipeList = await RecipeList.findOne({ _id: id, userId: userId });

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

  const userId = req.user?._id || req.user?.id;

  try {
    const list = await RecipeList.findOneAndDelete({ _id: id, userId: userId });
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

// Add a recipe to a recipe list
export const addRecipeToList = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id: listId } = req.params;
    const { recipe } = req.body;

    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Find the list and make sure it belongs to the user
    const recipeList = await RecipeList.findOne({ _id: listId, userId: userId });

    if (!recipeList) {
      return res.status(404).json({
        success: false,
        message: 'Recipe list not found',
      });
    }

    // Check if recipe exists, if not create it
    let savedRecipe: IRecipeDocument | null = await Recipe.findOne({ externalId: recipe.id });

    if (!savedRecipe) {
      savedRecipe = await Recipe.create({
        externalId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        diets: recipe.diets || [],
        dishTypes: recipe.dishTypes || [],
        cuisines: recipe.cuisines || [],
      });
    }

    // Check if recipe is already in the list
    const recipeExists = recipeList.recipes.some(
      (id) => id.toString() === savedRecipe!._id.toString(),
    );

    if (recipeExists) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in list',
      });
    }

    // Add recipe to list and save
    await RecipeList.updateOne({ _id: listId }, { $push: { recipes: savedRecipe._id } });

    // Get updated list
    const updatedList = await RecipeList.findById(listId).populate('recipes');

    return res.status(200).json({
      success: true,
      list: updatedList,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Remove a recipe from a recipe list
export const removeRecipeFromList = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { listId, recipeId } = req.params;
    // Use req.user directly (assuming auth middleware adds this)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = await RecipeList.updateOne(
      { _id: listId, user: userId, recipes: recipeId },
      {
        $pull: { recipes: new Types.ObjectId(recipeId) },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'List not found or recipe not in list',
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipe not removed',
      });
    }

    // Get updated list
    const updatedList = await RecipeList.findById(listId).populate('recipes');

    return res.status(200).json({
      success: true,
      list: updatedList,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
