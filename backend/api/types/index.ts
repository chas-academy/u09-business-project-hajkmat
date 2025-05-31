import { User } from './auth';
import { Recipe } from './recipe';

declare global {
  export interface User {
    id: string;
    displayName: string;
    email: string;
  }
}

export type { User, Recipe };
