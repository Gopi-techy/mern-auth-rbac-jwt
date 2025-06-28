// server.js
// Main entry point for the backend server. Sets up Express, security, routes, and database connection.
// For beginners: This file wires together all the features (auth, MFA, OAuth, admin, etc.)

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet'; // Adds security headers
import cookieParser from 'cookie-parser'; // Parses cookies for refresh tokens
import connectDB from './config/db.js'; // MongoDB connection
import authRoutes from './routes/authRoutes.js'; // Auth endpoints (register, login, etc)
import userRoutes from './routes/userRoutes.js'; // Admin/user management endpoints
import mfaRoutes from './routes/mfaRoutes.js'; // Multi-factor authentication endpoints
import passport from './config/passport.js'; // OAuth 2.0 config
import oauthRoutes from './routes/oauthRoutes.js'; // OAuth 2.0 endpoints

dotenv.config();
const app = express();

// Security best practices
app.use(helmet()); // Set secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend
  credentials: true // Allow cookies
}));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(passport.initialize()); // Initialize OAuth

// Routes
app.use('/api/auth', authRoutes); // Auth (register, login, etc)
app.use('/api/user', userRoutes); // User/admin management
app.use('/api/mfa', mfaRoutes); // MFA endpoints
app.use('/api/oauth', oauthRoutes); // OAuth 2.0 endpoints

// Connect DB and Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
