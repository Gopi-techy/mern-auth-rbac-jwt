// Role-based access control (RBAC) middleware
// Restricts access to routes based on user roles (e.g., admin, user)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Role not allowed' });
    }
    next(); // User has required role, continue
  };
};
