// Passport configuration for Google OAuth 2.0
// Sets up Google login strategy and user serialization
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();


// Debug: Log Google OAuth env variables to verify they are loaded
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Google client ID from .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from .env
  callbackURL: '/api/oauth/google/callback', // Callback URL after Google login
}, async (accessToken, refreshToken, profile, done) => {
  // Find user by email, or create a new user if not found
  let user = await User.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = new User({
      username: profile.displayName,
      email: profile.emails[0].value,
      emailVerified: true, // Google users are considered verified
      role: 'user', // Default role
    });
    await user.save();
  }
  return done(null, user); // Pass user to next middleware
}));

// Serialize user ID to session (not used with JWT, but required by Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// Deserialize user from session by ID
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
