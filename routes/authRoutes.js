import express from 'express';
import { register, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route for all users
router.get('/user-data', protect, authorize('user', 'admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.role}!` });
});

// Admin-only route
router.get('/admin-data', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin. Confidential Data Accessed.' });
});

export default router;
