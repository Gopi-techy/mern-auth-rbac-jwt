// User management controller
// Handles admin and user profile actions
import User from '../models/User.js';

// Admin: Get all users (excluding sensitive fields)
export const getAllUsers = async (req, res) => {
  const users = await User.find({}, '-password -refreshToken'); // Exclude sensitive fields
  res.json(users);
};

// Admin: Delete a user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted' });
};

// Admin: Update a user's role (e.g., promote to admin)
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.role = role;
  await user.save();
  res.json({ message: 'User role updated' });
};

// User: Update their own profile (e.g., change username)
export const updateProfile = async (req, res) => {
  const { username } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.username = username || user.username;
  await user.save();
  res.json({ message: 'Profile updated' });
};
