# MERN Auth RBAC JWT - Complete Full-Stack Application

This is a complete, production-ready MERN stack authentication system with advanced security features, role-based access control, and a modern React frontend.

## 🚀 Features

### Backend Features

- **JWT Authentication** with access and refresh tokens
- **Role-Based Access Control (RBAC)** - Admin and User roles
- **Multi-Factor Authentication (MFA)** with TOTP (Google Authenticator, Authy)
- **Email Verification** with secure token-based verification
- **Password Reset** with secure email flow
- **Google OAuth 2.0** integration
- **Account Security** - Account lockout after failed attempts
- **Rate Limiting** to prevent brute-force attacks
- **Audit Logging** for security events
- **Input Validation** and sanitization
- **Security Headers** with Helmet.js
- **CORS** configuration
- **Password Hashing** with bcrypt

### Frontend Features

- **Modern React 18** with hooks and context
- **Responsive Design** with Tailwind CSS
- **Form Handling** with React Hook Form and validation
- **Beautiful Notifications** with React Hot Toast
- **Protected Routes** with role-based access
- **Google OAuth Integration** with one-click login
- **MFA Setup** with QR code generation
- **Admin Dashboard** for user management
- **Profile Management** with security settings
- **Modern Icons** with Lucide React

## 🛠️ Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file:**

   ```bash
   # Database
   MONGO_URI=mongodb://localhost:27017/mern-auth

   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-here
   REFRESH_TOKEN_SECRET=your-refresh-token-secret-here

   # Email Configuration (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Security Features

- **Password Hashing** with bcrypt (12 rounds)
- **Account Lockout** after 5 failed login attempts
- **Rate Limiting** on login endpoints
- **Input Validation** and sanitization
- **CORS** protection
- **Security Headers** with Helmet.js
- **Audit Logging** for security events
- **JWT Tokens** with automatic refresh
- **MFA Support** with TOTP

## 📱 Application Flow

1. **Register** → Email verification required
2. **Login** → Optional MFA challenge
3. **Dashboard** → User profile and settings
4. **Admin Panel** → User management (admin only)
5. **Profile** → Security settings and MFA setup

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### MFA

- `POST /api/mfa/enable` - Enable MFA
- `POST /api/mfa/verify` - Verify MFA setup

### User Management

- `GET /api/user/users` - Get all users (admin only)
- `DELETE /api/user/users/:id` - Delete user (admin only)
- `PATCH /api/user/users/:id/role` - Update user role (admin only)
- `PATCH /api/user/me` - Update own profile

### OAuth

- `GET /api/oauth/google` - Initiate Google OAuth
- `GET /api/oauth/google/callback` - Google OAuth callback

## 🚀 Deployment

### Backend Deployment

1. Deploy to Heroku, Railway, or DigitalOcean
2. Set environment variables
3. Configure MongoDB Atlas
4. Set up email service (SendGrid, etc.)

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or static hosting
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

- 🔐 Role-Based Access Control (User/Admin)
- 🛡️ Protected API Routes
- 🧾 Password Hashing with Bcrypt
- 🌐 React Frontend Integration
- ⚙️ Environment Configuration
- 📦 Ready for Docker/Deployment

---
