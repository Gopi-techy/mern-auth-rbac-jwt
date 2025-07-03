// controllers/authController.js
// Handles registration, login, JWT, refresh tokens, email verification, password reset, and audit logging.
// For beginners: This file contains the main logic for user authentication and security features.

import jwt from 'jsonwebtoken'; // For JWT tokens
import User from '../models/User.js';
import { body, validationResult } from 'express-validator'; // Input validation
import rateLimit from 'express-rate-limit'; // Rate limiting
import crypto from 'crypto'; // Token generation
import { sendEmail } from '../utils/mailer.js'; // Email sending
import { logAction } from '../utils/auditLogger.js'; // Audit logging
import { totp } from 'speakeasy'; // For MFA

// Generate access token (short-lived)
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (long-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'Email already in use' });

  const user = new User({ username, email, password });
  const verifyToken = user.createEmailVerificationToken();
  await user.save();
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verifyToken}`;
  await sendEmail(
    user.email,
    'Verify your email',
    `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
  );
  res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.json({ message: 'Email verified successfully' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (!user.emailVerified) {
    return res.status(401).json({ message: 'Please verify your email before logging in.' });
  }
  if (user.isLocked()) {
    return res.status(423).json({ message: 'Account locked due to too many failed login attempts. Try again later.' });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lock
      await user.save();
      return res.status(423).json({ message: 'Account locked due to too many failed login attempts. Try again later.' });
    }
    await user.save();
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  if (user.mfaEnabled) {
    if (!req.body.token) {
      return res.status(401).json({ message: 'MFA code required', mfaRequired: true });
    }
    const valid = totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: req.body.token
    });
    if (!valid) {
      return res.status(401).json({ message: 'Invalid MFA code' });
    }
  }
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  // Generate and store refresh token
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  const token = generateToken(user);
  logAction('login', user._id);
  res.status(200).json({ token });
};

// Rate limiter for login endpoint (prevents brute-force attacks)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

// Refresh token endpoint
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// Logout endpoint: clears refresh token
export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }
  res.clearCookie('refreshToken');
  logAction('logout', req.user ? req.user.id : 'unknown');
  res.json({ message: 'Logged out successfully' });
};

// Request password reset: send email with reset token
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  await sendEmail(
    user.email,
    'Password Reset Request',
    `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`
  );
  logAction('requestPasswordReset', user._id);
  res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
};

// Reset password using token
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  logAction('resetPassword', user._id);
  res.json({ message: 'Password reset successful. You can now log in.' });
};

// Input validation for registration
export const validateRegister = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Input validation for login
export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
