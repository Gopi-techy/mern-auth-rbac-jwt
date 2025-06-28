# MERN Auth RBAC JWT Backend

This is the backend for a full-featured, production-grade MERN authentication and authorization system. It includes JWT authentication, role-based access control (RBAC), multi-factor authentication (MFA) with TOTP, email verification, password reset, refresh tokens, Google OAuth 2.0, admin/user management, audit logging, and security best practices.

## Features

- **User Registration & Login** (with JWT, refresh tokens, and account lockout)
- **Role-Based Access Control (RBAC)** (admin/user)
- **Multi-Factor Authentication (MFA)** (TOTP via authenticator apps)
- **Email Verification** (with Nodemailer)
- **Password Reset** (secure email flow)
- **Google OAuth 2.0** (login with Google)
- **Audit Logging** (key actions logged)
- **Security Best Practices** (rate limiting, helmet, CORS, bcrypt, input validation)
- **Beginner-Friendly Comments** (all files are well-documented)

## Getting Started

### 1. Clone the repository

```
git clone <your-repo-url>
cd mern-auth-rbac-jwt/backend
```

### 2. Install dependencies

```
npm install
```

### 3. Create a `.env` file

Copy `.env.example` to `.env` and fill in your values:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
SMTP_FROM=your_from_email
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### 4. Start the server

```
npm start
```

The server will run on `http://localhost:5000` by default.

## API Documentation

- All endpoints are documented in the included Postman collection (`postman_collection.json`).
- Each endpoint has a clear name, description, and usage notes for beginners.

## Folder Structure

- `controllers/` — Business logic for authentication, users, MFA, etc.
- `middleware/` — Authentication, RBAC, and other middleware.
- `models/` — Mongoose models (User, etc).
- `routes/` — Express route definitions.
- `utils/` — Utility functions (mailer, audit logger).
- `config/` — Configuration files (database, passport).

## Security Notes

- All sensitive operations are protected by JWT and RBAC middleware.
- MFA is required for extra security (TOTP via Google Authenticator, Authy, etc).
- Email verification and password reset flows are secure and beginner-friendly.
- Audit logs are written to `backend/audit.log`.

## Contributing

Pull requests are welcome! Please ensure your code is well-commented and beginner-friendly.

## License

MIT
