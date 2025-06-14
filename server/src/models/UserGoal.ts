import mongoose, { Schema, Document } from 'mongoose';

export interface IUserGoal extends Document {
  userId: mongoose.Types.ObjectId;
  goals: {
    type: string;
    description: string;
    targetDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    progress: number;
  }[];
  preferences: {
    preferredTime: string[];
    preferredDays: string[];
    preferredDuration: number;
    preferredYogaLevel: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserGoalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goals: [{
    type: {
      type: String,
      required: true,
      enum: ['flexibility', 'strength', 'meditation', 'weight_loss', 'stress_reduction', 'custom']
    },
    description: {
      type: String,
      required: true
    },
    targetDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  preferences: {
    preferredTime: [{
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night']
    }],
    preferredDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    preferredDuration: {
      type: Number,
      min: 15,
      max: 120,
      default: 30
    },
    preferredYogaLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IUserGoal>('UserGoal', UserGoalSchema); 