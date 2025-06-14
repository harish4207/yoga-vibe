import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  billingCycle: 'monthly' | 'yearly';
  features: {
    maxLiveSessions: number;
    maxOnDemandContent: number;
    hasCommunityAccess: boolean;
    hasPersonalizedPlan: boolean;
    hasProgressTracking: boolean;
    hasChallengesAccess: boolean;
  };
  isActive: boolean;
}

const SubscriptionPlanSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  monthlyPrice: { type: Number, required: true, min: 0 },
  yearlyPrice: { type: Number, required: true, min: 0 },
  billingCycle: { type: String, required: true, enum: ['monthly', 'yearly'] },
  features: {
    maxLiveSessions: { type: Number, required: true, min: 0 },
    maxOnDemandContent: { type: Number, required: true, min: 0 },
    hasCommunityAccess: { type: Boolean, required: true, default: false },
    hasPersonalizedPlan: { type: Boolean, required: true, default: false },
    hasProgressTracking: { type: Boolean, required: true, default: false },
    hasChallengesAccess: { type: Boolean, required: true, default: false },
  },
  isActive: { type: Boolean, required: true, default: true },
}, { timestamps: true });

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan; 