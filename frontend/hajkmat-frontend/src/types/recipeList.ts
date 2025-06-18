import { Recipe } from './recipe';

export interface RecipeList {
  _id: string;
  id?: string; // Include both for flexibility
  name: string;
  userId: string;
  recipes: Recipe[];
  createdAt?: Date;
  updatedAt?: Date;
}
