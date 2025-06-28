// MFA (Multi-Factor Authentication) routes
// Endpoints for enabling and verifying TOTP-based MFA
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Require user to be logged in
import { enableMfa, verifyMfa } from '../controllers/mfaController.js';

const router = express.Router();

// User must be logged in to enable or verify MFA
router.post('/enable', protect, enableMfa); // Get QR code and secret for MFA setup
router.post('/verify', protect, verifyMfa); // Verify TOTP code and enable MFA

export default router;
