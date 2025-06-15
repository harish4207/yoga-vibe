import { IUser } from '../../models/User';
import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: (IUser & Document) | undefined;
    }
  }
} 