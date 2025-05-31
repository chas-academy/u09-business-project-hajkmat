import { User } from './auth';
import { Recipe } from './recipe';

declare global {
  namespace Express {
    interface User {
      id: string;
      _id: string;
      googleId: string;
      displayName: string;
      email: string;
      recipeLists: any[];
    }
  }
}

export type { User, Recipe };
