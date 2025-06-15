import { Request } from 'express';
import { JwtPayload as _JwtPayload } from 'jsonwebtoken';
import { IUser } from '../models/User';

// Define an interface for the JWT payload
interface JwtPayload extends _JwtPayload {
  id: string; // User ID from MongoDB (_id)
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File; // For single file uploads
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }; // For multiple file uploads
    }
  }
}

// This is a placeholder to ensure this file is treated as a module
export {}; 