import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

// This is a placeholder to ensure this file is treated as a module
export {};