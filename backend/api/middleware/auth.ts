import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../models/user';

declare global {
  namespace Express {
    // Use IUser properties to define User
    interface User extends Omit<IUser, 'id'> {
      id: string;
      googleId: string;
      email: string;
      name: string;
      recipeLists: any[];
    }
  }
}

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

export const initializePassport = (req: Request, res: Response, next: NextFunction) => {
  passport.initialize()(req, res, next);
};

export const sessionPassport = (req: Request, res: Response, next: NextFunction) => {
  passport.session()(req, res, next);
};

export const authenticate = ensureAuthenticated;
