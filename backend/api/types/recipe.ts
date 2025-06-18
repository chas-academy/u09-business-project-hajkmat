import { Document } from 'mongoose';

export interface IRecipe {
  id: number;
  externalId: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
}

export interface IRecipeList extends Document {
  id: string;
  name: string;
  userId: string;
  recipes: IRecipe[];
}
