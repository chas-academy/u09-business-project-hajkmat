import { Document } from 'mongoose';

export interface IRecipe {
  recipeId: string;
  name: string;
}

export interface IRecipeList extends Document {
  name: string;
  userId: string;
  recipes: IRecipe[];
}
