import { Request, Response } from 'express';
import passport from 'passport';
import User from '../models/user';

// Login function
export const login = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ error: info.message });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Login failed' });
      }
      return res.status(200).json({ user });
    });
  })(req, res);
};

// Register function (if needed)
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, name } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
    }
    const newUser = new User({ email, name });
    await newUser.save();
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout function
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(400).json({ error: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};
