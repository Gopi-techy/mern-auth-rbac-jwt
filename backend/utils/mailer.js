// Utility for sending emails (e.g., verification, password reset)
// Uses Nodemailer and SMTP config from environment variables
import nodemailer from 'nodemailer';

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
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com', // Default sender
    to,
    subject,
    html,
  });
};
