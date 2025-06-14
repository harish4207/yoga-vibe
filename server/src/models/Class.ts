import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  price: number;
  maxStudents: number;
  schedule: {
    startTime: Date;
    endTime: Date;
    recurring: boolean;
    daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
  };
  location: {
    type: 'online' | 'in-person';
    address?: string;
    meetingLink?: string;
  };
  enrolledStudents: mongoose.Types.ObjectId[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    title: {
      type: String,
      required: [true, 'Class title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Class description is required'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Instructor is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hatha',
        'Vinyasa',
        'Ashtanga',
        'Yin',
        'Power',
        'Restorative',
        'Meditation',
        'Kundalini',
        'Iyengar',
        'Bikram',
        'Prenatal',
        'Kids',
        'Other'
      ],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    maxStudents: {
      type: Number,
      required: [true, 'Maximum number of students is required'],
      min: [1, 'Maximum students must be at least 1'],
    },
    schedule: {
      startTime: {
        type: Date,
        required: [true, 'Start time is required'],
      },
      endTime: {
        type: Date,
        required: [true, 'End time is required'],
      },
      recurring: {
        type: Boolean,
        default: false,
      },
      daysOfWeek: {
        type: [Number],
        validate: {
          validator: function(v: number[]) {
            return v.every(day => day >= 0 && day <= 6);
          },
          message: 'Days must be between 0 and 6',
        },
      },
    },
    location: {
      type: {
        type: String,
        required: [true, 'Location type is required'],
        enum: ['online', 'in-person'],
      },
      address: String,
      meetingLink: String,
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
classSchema.index({ instructor: 1 });
classSchema.index({ category: 1 });
classSchema.index({ level: 1 });
classSchema.index({ 'schedule.startTime': 1 });
classSchema.index({ status: 1 });

export default mongoose.model<IClass>('Class', classSchema); 