import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './User';

export interface IYogaClass extends Document {
  title: string;
  description: string;
  instructor: IUser;
  type: 'live' | 'recorded';
  style: 'hatha' | 'vinyasa' | 'ashtanga' | 'yin' | 'restorative' | 'power';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  capacity: number;
  booked: number;
  price: number;
  date: Date;
  videoUrl?: string;
  thumbnailUrl?: string;
  paymentPlanId?: string;
  paymentAmount?: number;
  status: 'active' | 'inactive' | 'completed' | 'cancelled' | 'scheduled';
  enrolledStudents: mongoose.Types.ObjectId[];
  ratings: {
    user: IUser;
    rating: number;
    review?: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const yogaClassSchema = new Schema<IYogaClass>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide an instructor'],
    },
    type: {
      type: String,
      enum: ['live', 'recorded'],
      required: [true, 'Please specify the class type'],
    },
    style: {
      type: String,
      enum: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'restorative', 'power'],
      required: [true, 'Please specify the yoga style'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: [true, 'Please specify the difficulty level'],
    },
    duration: {
      type: Number,
      required: [true, 'Please specify the duration in minutes'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify the class capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    booked: {
      type: Number,
      default: 0,
      min: [0, 'Booked count cannot be negative'],
    },
    price: {
      type: Number,
      required: [true, 'Please specify the price'],
      min: [0, 'Price cannot be negative'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify the class date and time'],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    paymentPlanId: {
      type: String,
      sparse: true,
    },
    paymentAmount: {
      type: Number,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed', 'cancelled', 'scheduled'],
      default: 'scheduled',
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
yogaClassSchema.index({ date: 1, type: 1 });
yogaClassSchema.index({ style: 1, level: 1 });
yogaClassSchema.index({ instructor: 1 });

export const YogaClass = mongoose.model<IYogaClass>('YogaClass', yogaClassSchema); 