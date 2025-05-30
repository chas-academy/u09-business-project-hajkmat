import { Router } from 'express';
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
  (req, res) => {
    // Successful authentication, redirect home or send user data
    res.redirect('/');
  },
);

// Login route
router.post('/login', login);

// Registration route
router.post('/register', register);

export default router;
