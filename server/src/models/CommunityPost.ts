import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityPost extends Document {
  author: mongoose.Types.ObjectId; // Reference to the User who created the post
  content: string; // The main text of the post
  likes: mongoose.Types.ObjectId[]; // Array of User IDs who liked the post
  comments: IComment[]; // Array of embedded comments
  isDeleted: boolean; // Soft delete flag
  isFlagged: boolean; // Flagged for moderation
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  author: mongoose.Types.ObjectId; // Reference to the User who created the comment
  content: string; // The text of the comment
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const CommunityPostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema], // Embed comments within the post
  isDeleted: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<ICommunityPost>('CommunityPost', CommunityPostSchema); 