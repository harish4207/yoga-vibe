import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description?: string;
  contentType: 'youtube' | 'website' | 'article' | 'manual_video' | 'pdf';
  url: string; // For links or file URLs
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  contentType: {
    type: String,
    required: true,
    enum: ['youtube', 'website', 'article', 'manual_video', 'pdf'],
  },
  url: { type: String, required: true, trim: true },
}, { timestamps: true });

export const Content = mongoose.model<IContent>('Content', ContentSchema); 