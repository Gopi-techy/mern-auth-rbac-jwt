// OAuth 2.0 authentication routes (Google)
// Handles Google login and callback, issues JWT on success
import express from 'express';
import passport from '../config/passport.js'; // Passport config for Google OAuth
import jwt from 'jsonwebtoken';

const router = express.Router();

// Start Google OAuth login flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback (after user authenticates with Google)
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Issue JWT after successful Google login
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    // Redirect to frontend with token as query param (or send as JSON)
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-success?token=${token}`);
  }
);

export default router;
