import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

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
