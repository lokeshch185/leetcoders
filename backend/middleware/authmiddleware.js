/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 * Extracts user information from the token and attaches it to the request object
 */

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // Get JWT secret from environment variables
  const JWT_SECRET = process.env.JWT_SECRET;
  
  // Validate JWT secret is configured
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not configured in environment variables');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Extract token from Authorization header
  // Format: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: 'Authorization header is required' });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }
  
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Validate decoded token structure
    if (!decoded || !decoded.id) {
      console.error('Invalid token structure:', decoded);
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    // Attach user information to request object
    req.userid = decoded;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'JsonWebTokenError') {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      console.error('Token expired:', err.message);
      return res.status(401).json({ message: 'Token expired' });
    }
    
    // Handle other errors
    console.error('Unexpected error during token verification:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
