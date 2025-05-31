import { Document } from 'mongoose';
import { IRecipe } from './recipe';

export interface IUser extends Document {
  googleId: string;
  displayName: string;
  email: string;
  name: string;
  recipeLists: IRecipe[];
}
