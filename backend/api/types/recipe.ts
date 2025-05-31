import { Document } from 'mongoose';

export interface IRecipe {
  recipeId: string;
  name: string;
}

export interface IRecipeList extends Document {
  userId: string;
  recipes: IRecipe[];
}
