import { User } from './auth';
import { Recipe } from './recipe';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type { User, Recipe };
