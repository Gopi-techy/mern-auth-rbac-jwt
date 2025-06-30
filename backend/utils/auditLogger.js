// Simple audit logger utility
// Appends key user actions to a log file for auditing and security
import fs from 'fs';
import path from 'path';

// Path to the audit log file (in backend directory)
const logFile = path.join(process.cwd(), 'audit.log');

// Log an action (action name, user ID, optional details)
export const logAction = (action, userId, details = '') => {
  const entry = `${new Date().toISOString()} | User: ${userId} | Action: ${action} | ${details}\n`;
  fs.appendFileSync(logFile, entry); // Append entry to log file
};
