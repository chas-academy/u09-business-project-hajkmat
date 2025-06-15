import express, { Request, Response } from 'express';
import { login, register } from '../controllers/authControllers';
import passport from 'passport';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../config/env';
import { authenticate } from '../middleware/auth';
import RecipeList from '../models/recipeList';
import User from '../models/user';

console.log('Auth routes file loaded');

interface UserPayload extends JwtPayload {
  id: string;
  displayName: string;
  email?: string;
  picture?: string;
}

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production' ? 'https://hajkmat.netlify.app' : 'http://localhost:5173',
  credentials: true,
};
const router = express.Router();
router.get('/test', (req, res) => {
  console.log('Auth test route accessed');
  res.json({ message: 'Auth test route works' });
});
// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      // Generate JWT token using the JWT_SECRET
      const token = jwt.sign(
        {
          id: req.user._id,
          displayName: req.user.displayName,
          email: req.user.email,
          // Use optional chaining for nested properties that might not exist
          picture: req.user.picture,
        },
        env.JWT_SECRET, // Use your environment config
        { expiresIn: '24h' },
      );

      console.log(`Token generated for user: ${req.user.displayName}`);

      // Redirect with token to frontend
      const redirectUrl = `${process.env.FRONTEND_URL}/auth-callback?token=${token}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  },
);
// Endpoint to verify token
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.log('No token provided in verification request');
      res.status(401).json({ isAuthenticated: false });
      return; // Return without a value
    }

    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;

    console.log(`Token verified for user: ${decoded.displayName}`);

    res.status(200).json({
      isAuthenticated: true,
      user: decoded,
    });
    // No return statement here
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ isAuthenticated: false });
    // No return statement here
  }
});

// Add an endpoint to check authentication status
router.get('/check', cors(corsOptions), (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Not authenticated',
    });
  }
});

// Login route
router.post('/login', login);

// Registration route
router.post('/register', register);

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error during logout' });
    }
    res.status(200).json({ success: true });
  });
});

router.delete('/delete-account', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await RecipeList.deleteMany({ user: userId });

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

router.route('/delete-account-alt').delete(authenticate, async (req, res) => {
  try {
    const userId = (req.user as any).id;
    res.status(200).json({ message: 'Account deleted via alt route' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete via alt route' });
  }
});

console.log(
  'Auth routes registered:',
  router.stack.filter((layer) => layer.route).map((layer) => layer.route?.path),
);

export default router;
