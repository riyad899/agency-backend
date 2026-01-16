// JWT Cookie Authentication Middleware for Express.js TypeScript backend

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

// Main JWT verification middleware - reads token from cookies
export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 🔍 DEBUG: Log all cookies received
    console.log("🍪 Cookies:", req.cookies);
    
    // 🔑 KEY POINT: Read token from COOKIES, not Authorization header
    const token = req.cookies['auth-token']; // Cookie name: 'auth-token'
    
    console.log("🔑 Token from cookie:", token ? "Found" : "Not found");
    console.log("🔐 JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No");

    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required - no token in cookies' 
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.log("❌ JWT_SECRET is missing from environment variables");
      res.status(500).json({ 
        success: false, 
        message: 'Server configuration error - JWT secret not found' 
      });
      return;
    }

    // 🔍 DEBUG: Decode token without verification to see payload
    try {
      const decoded = jwt.decode(token) as any;
      console.log("🔍 Token payload (unverified):", decoded);
    } catch (decodeError) {
      console.log("❌ Cannot decode token:", decodeError);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    console.log("✅ Token decoded successfully:", { id: decoded.id, email: decoded.email, role: decoded.role });
    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token - signature mismatch. Please login again.' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Token verification failed' 
      });
    }
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['admin']);

// User or Admin middleware
export const requireUserOrAdmin = requireRole(['user', 'admin']);

// User-only middleware
export const requireUser = requireRole(['user']);

// Optional token middleware (doesn't fail if no token) - reads from cookies
export const optionalToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies['auth-token'];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      req.user = decoded;
    }
    
    next(); // Continue regardless of token presence
  } catch (error) {
    // Ignore token errors and continue
    next();
  }
};

// Legacy middleware for backward compatibility
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  requireAdmin(req, res, next);
};

export const isUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  requireUser(req, res, next);
};

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  requireUserOrAdmin(req, res, next);
};

export default { 
  verifyToken, 
  requireRole, 
  requireAdmin, 
  requireUserOrAdmin, 
  requireUser,
  optionalToken,
  isAdmin,
  isUser,
  isAuthenticated
};
