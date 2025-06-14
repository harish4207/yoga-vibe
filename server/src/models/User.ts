import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'user' | 'instructor' | 'admin';
  profilePicture?: string;
  bio?: string;
  phone?: string;
  yogaLevel?: string;
  stripeCustomerId?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  enrolledClasses: mongoose.Types.ObjectId[];
  teachingClasses: mongoose.Types.ObjectId[];
  subscription?: {
    plan: 'basic' | 'premium' | 'elite';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  otp?: string;
  otpExpire?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: function(this: IUser) { return !this.googleId; },
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user', 'instructor', 'admin'],
      default: 'user',
    },
    profilePicture: String,
    bio: String,
    phone: String,
    yogaLevel: String,
    stripeCustomerId: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    enrolledClasses: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    teachingClasses: [{
      type: Schema.Types.ObjectId,
      ref: 'Class',
    }],
    subscription: {
      plan: {
        type: String,
        enum: ['basic', 'premium', 'elite'],
        default: 'basic',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'inactive',
      },
      startDate: Date,
      endDate: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Check if password is being modified and is not already hashed
  if (this.isModified('password') && this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return Promise.resolve(false);
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Add indexes for better query performance
// userSchema.index({ email: 1 }); // Removed as unique: true is already set above
userSchema.index({ role: 1 });
userSchema.index({ stripeCustomerId: 1 });
// userSchema.index({ googleId: 1 }, { unique: true, sparse: true }); // Removed as unique: true, sparse: true is already set above

export const User = mongoose.model<IUser>('User', userSchema); 