import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string; email: string; role: string };
  }
}

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  console.log('AuthenticateJWT: Incoming Authorization header:', authHeader);

  if (!token) {
    console.log('AuthenticateJWT: No token provided.');
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'my_super_secret_key';
    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; iat: number; exp: number };
    console.log('AuthenticateJWT: Token verified successfully. Decoded:', decoded);

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    console.error('AuthenticateJWT: Token verification failed:', err);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have sufficient permissions' });
    }
    next();
  };
}; 