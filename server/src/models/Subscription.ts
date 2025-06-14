import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './User';

export interface ISubscription extends Document {
  user: IUser;
  plan: 'basic' | 'premium' | 'elite';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    plan: {
      type: String,
      enum: ['basic', 'premium', 'elite'],
      required: [true, 'Please specify the subscription plan'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify the start date'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify the end date'],
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
// Removed: subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });

// Middleware to check subscription expiration
subscriptionSchema.pre('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (this.isModified('endDate') || this.isNew) {
    if (this.endDate < new Date()) {
      this.status = 'expired';
    }
  }
  next();
});

// Static method to get subscription benefits
subscriptionSchema.statics.getPlanBenefits = function (plan: 'basic' | 'premium' | 'elite') {
  const benefits = {
    basic: {
      maxClassesPerMonth: 4,
      videoAccess: false,
      liveClasses: true,
      personalInstructor: false,
      price: 29.99,
    },
    premium: {
      maxClassesPerMonth: 12,
      videoAccess: true,
      liveClasses: true,
      personalInstructor: false,
      price: 49.99,
    },
    elite: {
      maxClassesPerMonth: -1, // unlimited
      videoAccess: true,
      liveClasses: true,
      personalInstructor: true,
      price: 99.99,
    },
  };
  return benefits[plan];
};

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema); 