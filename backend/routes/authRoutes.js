import express from 'express';
import { register, login, validateRegister, validateLogin, loginLimiter, requestPasswordReset, resetPassword, verifyEmail } from '../controllers/authController.js';
import { protect, refreshToken } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected route for all users
router.get('/user-data', protect, authorize('user', 'admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.role}!` });
});

// Admin-only route
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin. Confidential Data Accessed.' });
});

export default router;
