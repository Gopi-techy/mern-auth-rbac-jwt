// models/User.js
// Mongoose schema for User. Handles password hashing, roles, MFA, email verification, etc.
// For beginners: This is the blueprint for user data in MongoDB.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // For hashing passwords
import crypto from 'crypto'; // For generating tokens

const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // User's display name
  email:    { type: String, required: true, unique: true }, // User's email (unique)
  password: { type: String, required: true }, // Hashed password
  role:     { type: String, enum: ['user', 'admin'], default: 'user' }, // Role for RBAC
  failedLoginAttempts: { type: Number, default: 0 }, // For account lockout
  lockUntil: { type: Date }, // Lockout expiry
  resetPasswordToken: String, // For password reset
  resetPasswordExpires: Date, // Password reset expiry
  emailVerified: { type: Boolean, default: false }, // Email verification status
  emailVerificationToken: String, // Email verification token
  emailVerificationExpires: Date, // Email verification expiry
  refreshToken: String, // Stores the user's refresh token for session management
  mfaEnabled: { type: Boolean, default: false }, // Is MFA enabled for this user?
  mfaSecret: String, // TOTP secret for MFA
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePwd) {
  return await bcrypt.compare(candidatePwd, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verifyToken;
};

export default mongoose.model('User', userSchema);
