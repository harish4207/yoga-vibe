import { Request } from 'express';
import { Document } from 'mongoose';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser & Document;
}

// This is a placeholder to ensure this file is treated as a module
export {};