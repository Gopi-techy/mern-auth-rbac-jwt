# MERN Auth Frontend

This is the React frontend for the MERN Auth RBAC JWT system. It provides a modern, responsive user interface for authentication, user management, and security features.

## Features

- **Authentication UI**: Login, register, email verification, password reset
- **Multi-Factor Authentication**: Complete MFA setup with QR code scanning
- **User Dashboard**: Profile management and security settings
- **Admin Panel**: User management for administrators
- **Google OAuth Integration**: One-click login with Google
- **Responsive Design**: Works on all devices with Tailwind CSS
- **Security Features**: Protected routes, role-based access control

## Tech Stack

- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: Beautiful notifications
- **Lucide React**: Modern icon library

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open http://localhost:3000 in your browser

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar
│   └── ProtectedRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # User dashboard
│   ├── Profile.js      # Profile settings
│   ├── Admin.js        # Admin panel
│   ├── ForgotPassword.js # Password reset request
│   ├── ResetPassword.js # Password reset form
│   ├── VerifyEmail.js  # Email verification
│   └── OAuthSuccess.js # OAuth callback
├── App.js              # Main app component
├── index.js            # Entry point
└── index.css           # Global styles
```

## API Integration

The frontend communicates with the backend API through:

- **Authentication**: Login, register, logout, token refresh
- **User Management**: Profile updates, MFA setup
- **Admin Functions**: User management, role updates
- **Security**: Email verification, password reset

## Authentication Flow

1. **Registration**: User creates account → Email verification required
2. **Login**: Email/password → Optional MFA → Access granted
3. **Token Management**: Automatic token refresh using HTTP-only cookies
4. **Logout**: Clear tokens and redirect to home

## Security Features

- **Protected Routes**: Authentication required for sensitive pages
- **Role-Based Access**: Admin-only sections
- **Token Management**: Automatic refresh with secure cookies
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error messages

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Environment Variables

The frontend uses these environment variables:

```bash
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## Deployment

1. Build the production version:

   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

3. Configure your web server to serve the React app and handle client-side routing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
