// Utility for sending emails (e.g., verification, password reset)
// Uses Nodemailer and SMTP config from environment variables
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// Create a reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS if true, else false
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send an email (to, subject, html body)
export const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com', // Default sender
    to,
    subject,
    html,
  });
  // If using Ethereal, log the preview URL for easy access
  if (process.env.SMTP_HOST && process.env.SMTP_HOST.includes('ethereal.email')) {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  }
};
