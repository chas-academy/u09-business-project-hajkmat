import { Router, Request, Response } from 'express';
import { login, register } from '../controllers/authControllers';
import passport from 'passport';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production' ? 'https://hajkmat.netlify.app' : 'http://localhost:5173',
  credentials: true,
};
const router = Router();

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
    // Extract user data
    const user = req.user;

    // Create JWT token with user data
    const token = jwt.sign(
      {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' },
    );

    // Redirect with token to frontend
    res.redirect(`https://hajkmat.netlify.app/auth-callback?token=${token}`);
  },
);
// Endpoint to verify token
router.post('/verify-token', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    res.status(200).json({
      isAuthenticated: true,
      user: decoded,
    });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
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

export default router;
