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

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Delete user by ID
    await User.findByIdAndDelete(user._id);

    // Also delete associated recipe lists
    await RecipeList.deleteMany({ user: user._id });

    // Step 1: Logout the user (for session-based auth)
    req.logout((logoutErr) => {
      if (logoutErr) {
        console.error('Error during logout after account deletion:', logoutErr);
        // Continue with session destruction even if logout fails
      }

      // Step 2: Destroy the session
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error('Error destroying session after account deletion:', sessionErr);
          res.status(200).json({
            message: 'Account deleted successfully, but session cleanup failed',
            logout: true,
          });
          return;
        }

        // Step 3: Clear any cookies
        res.clearCookie('connect.sid'); // Default Express session cookie

        // Step 4: Respond with success and signal frontend to clear tokens
        res.status(200).json({
          message: 'Account deleted successfully and logged out',
          logout: true,
        });
      });
    });
  } catch (error) {
    console.error('Error in deleteAccount:', error);
    res.status(500).json({ error: 'Server error while deleting account' });
  }
};
