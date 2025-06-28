// User-related routes
// Provides endpoints for admin and user profile management
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Auth middleware (JWT)
import { authorize } from '../middleware/roleMiddleware.js'; // Role-based access control
import { getAllUsers, deleteUser, updateUserRole, updateProfile } from '../controllers/userController.js';

const router = express.Router();

// Admin routes (only accessible by admin users)
router.get('/users', protect, authorize('admin'), getAllUsers); // Get all users
router.delete('/users/:id', protect, authorize('admin'), deleteUser); // Delete user
router.patch('/users/:id/role', protect, authorize('admin'), updateUserRole); // Update user role

// User route (accessible by logged-in users)
router.patch('/me', protect, updateProfile); // Update own profile

export default router;
