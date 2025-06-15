import { Request, Response } from 'express';
import passport from 'passport';
import User from '../models/user';
import RecipeList from '../models/recipeList';

// Login function
export const login = (req: Request, res: Response) => {
  passport.authenticate(
    'google',
    { session: false },
    (err: Error | null, user: Express.User, info: { message: string }) => {
      if (err || !user) {
        return res.status(400).json({ error: info?.message || 'Authentication failed' });
      }
      req.login(user, { session: false }, (err: Error | null) => {
        if (err) {
          return res.status(400).json({ error: 'Login failed' });
        }
        return res.status(200).json({ user });
      });
    },
  )(req, res);
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
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

// Logout function
export const logout = (req: Request, res: Response) => {
  req.logout((err: Error | null) => {
    if (err) {
      return res.status(400).json({ error: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get email from the authenticated user in the token
    const email = (req.user as any).email;

    if (!email) {
      res.status(400).json({ error: 'Email not found in authentication token' });
      return;
    }

    console.log('Attempting to delete user with email:', email);

    // First, find the user by email to get their ID
    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with email:', email);
      res.status(404).json({ error: 'User not found' });
      return;
    }

    console.log('Found user to delete:', user._id);

    // Delete user by ID
    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
      console.log('Failed to delete user with ID:', user._id);
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }

    // Also delete any associated recipe lists
    await RecipeList.deleteMany({ user: user._id });

    console.log('Successfully deleted user and their recipe lists');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
};
