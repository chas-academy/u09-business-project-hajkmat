import { Router, Request, Response } from 'express';
import { login, register } from '../controllers/authControllers';
import passport from 'passport';

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
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req: Request, res: Response) => {
    // Successful authentication
    // For development - adjust frontend URL in production
    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://hajkmat.netlify.app'
        : 'http://localhost:5173';

    res.redirect(`${frontendUrl}/dashboard`);
  },
);

// Add an endpoint to check authentication status
router.get('/check', (req: Request, res: Response) => {
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

export default router;
