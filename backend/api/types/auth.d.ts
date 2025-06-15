import { Document } from 'mongoose';
import { IRecipe } from '../models/recipeList';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  name?: string;
  recipeLists?: IRecipe[];
}

// Extend Express namespace properly
declare global {
  namespace Express {
    interface User {
      id: string;
      _id: string;
      googleId: string;
      displayName: string;
      email: string;
      name?: string;
      recipeLists?: IRecipe[];
      picture?: string;
    }
  }
}
