import mongoose, { Schema, Document } from 'mongoose';

export interface IUserContentInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  bookmarked: boolean;
  completed: boolean;
  rating?: number; // 1-5 rating
  feedback?: string;
  viewDuration?: number; // in seconds, for tracking engagement
  lastViewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserContentInteractionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  },
  viewDuration: {
    type: Number,
    min: 0
  },
  lastViewedAt: {
    type: Date
  }
}, {
  timestamps: true,
  // Ensure a user can only have one interaction record per content item
  indexes: [{ unique: true, fields: ['userId', 'contentId'] }]
});

export default mongoose.model<IUserContentInteraction>('UserContentInteraction', UserContentInteractionSchema); 