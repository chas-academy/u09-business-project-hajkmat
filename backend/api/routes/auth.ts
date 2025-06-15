import express, { Request, Response } from 'express';
import { login, register, deleteAccount } from '../controllers/authControllers';
import passport from 'passport';
import jwt, { JwtPayload } from 'jsonwebtoken';
import env from '../config/env';
import { authenticate } from '../middleware/auth';

// Define payload interface
interface UserPayload extends JwtPayload {
  id: string;
  displayName: string;
  email?: string;
  picture?: string;
}

const router = express.Router();

// Basic routes
router.get('/', (req, res) => {
  res.json({
    message: 'Auth API is working',
    availableRoutes: ['/login', '/register', '/delete-account'],
  });
});

router.get('/test', (req, res) => {
  res.json({ message: 'Auth test route works' });
});

router.delete('/test-delete', (req, res) => {
  res.json({ message: 'DELETE method works on auth router' });
});

// Authentication routes
router.post('/login', login);
router.post('/register', register);
router.delete('/delete-account', authenticate, deleteAccount);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      // Create JWT token
      const payload: UserPayload = {
        id: req.user._id.toString(),
        displayName: req.user.displayName || 'User',
        ...(req.user.email && { email: req.user.email }),
        ...(req.user.picture && { picture: req.user.picture }),
      };

      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
      res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  },
);

// Token verification
router.post('/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ isAuthenticated: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    res.status(200).json({ isAuthenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Error during logout' });
    res.status(200).json({ success: true });
  });
});

// Debug routes can be removed in production
router.get('/debug-token', authenticate, (req, res) => {
  res.json({
    user: req.user,
    hasId: typeof (req.user as any).id !== 'undefined',
    hasMongoId: typeof (req.user as any)._id !== 'undefined',
  });
});

export default router;
