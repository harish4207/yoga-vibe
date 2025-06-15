import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import mongoose, { Document } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser & Document;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: IUser & Document;
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  console.log('AuthenticateJWT: Incoming Authorization header:', authHeader);

  if (!token) {
    console.log('AuthenticateJWT: No token provided.');
    return res.status(401).json({ success: false, error: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'my_super_secret_key';
    const decoded = jwt.verify(token, secret) as { id: string };
    console.log('AuthenticateJWT: Token verified successfully. Decoded:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user as IUser & mongoose.Document;
    next();
  } catch (err) {
    console.error('AuthenticateJWT: Token verification failed:', err);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

export const authorizeRoles = (roles: ('user' | 'instructor' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as 'user' | 'instructor' | 'admin')) {
      return res.status(403).json({ success: false, error: 'Forbidden: You do not have sufficient permissions' });
    }
    next();
  };
}; 