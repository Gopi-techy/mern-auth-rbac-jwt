// routes/authRoutes.js
// Defines all authentication-related API endpoints (register, login, password reset, etc).
// For beginners: This file connects HTTP routes to controller functions for authentication.

import express from 'express';
import cookieParser from 'cookie-parser';
import { register, login, validateRegister, validateLogin, loginLimiter, requestPasswordReset, resetPassword, verifyEmail, refreshAccessToken, logout } from '../controllers/authController.js';
import { protect, refreshToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Registration and login
router.post('/register', validateRegister, register); // Register new user
router.post('/login', loginLimiter, validateLogin, login); // Login with email/password (+MFA if enabled)
router.post('/refresh-token', refreshAccessToken); // Get new access token using refresh token
router.post('/request-password-reset', requestPasswordReset); // Request password reset email
router.post('/reset-password', resetPassword); // Reset password with token
router.post('/verify-email', verifyEmail); // Verify email with token
router.post('/logout', logout); // Logout and clear refresh token

// Example protected route for all users
router.get('/user-data', protect, authorize('user', 'admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.role}!` });
});

// Example admin-only route
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin. Confidential Data Accessed.' });
});

export default router;
