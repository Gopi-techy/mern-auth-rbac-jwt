// Multi-Factor Authentication (MFA) controller
// Handles enabling, verifying, and using TOTP-based MFA for users
import User from '../models/User.js';
import speakeasy from 'speakeasy'; // Library for TOTP
import qrcode from 'qrcode'; // Library to generate QR codes

// Step 1: Generate MFA secret and QR code for user to scan in their authenticator app
export const enableMfa = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Generate a new TOTP secret for the user
  const secret = speakeasy.generateSecret({ name: `MERNAuth (${user.email})` });
  user.mfaSecret = secret.base32; // Store secret in user's record
  await user.save();
  // Generate a QR code for the user's authenticator app
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qr, secret: secret.base32 }); // Send QR and secret to frontend
};

// Step 2: Verify the MFA code entered by the user and enable MFA
export const verifyMfa = async (req, res) => {
  const { token } = req.body; // TOTP code from user
  const user = await User.findById(req.user.id);
  if (!user || !user.mfaSecret) return res.status(400).json({ message: 'MFA not initialized' });
  // Verify the TOTP code
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token
  });
  if (!verified) return res.status(400).json({ message: 'Invalid MFA code' });
  user.mfaEnabled = true; // Mark MFA as enabled
  await user.save();
  res.json({ message: 'MFA enabled successfully' });
};

// Step 3: During login, if MFA is enabled, require TOTP code
export const verifyMfaLogin = async (req, res) => {
  const { email, password, token } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  // If MFA is enabled, verify the TOTP code
  if (user.mfaEnabled) {
    const valid = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token
    });
    if (!valid) return res.status(401).json({ message: 'Invalid MFA code' });
  }
  // ...continue with normal login logic (reuse existing login controller)
  res.json({ message: 'MFA verified, continue login' });
};
