import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
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
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();
  const token = generateToken(user);
  res.status(200).json({ token });
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const resetToken = user.createPasswordResetToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  await sendEmail(
    user.email,
    'Password Reset',
    `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  );
  res.json({ message: 'Password reset email sent.' });
};

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
  res.json({ message: 'Password reset successful' });
};

export const validateRegister = [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts, please try again later.'
});
