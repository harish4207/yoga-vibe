import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './User';
import type { IYogaClass } from './YogaClass';

export interface IBooking extends Document {
  user: IUser;
  yogaClass: IYogaClass;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
    yogaClass: {
      type: Schema.Types.ObjectId,
      ref: 'YogaClass',
      required: [true, 'Please provide a yoga class'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the booking amount'],
      min: [0, 'Amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
bookingSchema.index({ user: 1, yogaClass: 1 }, { unique: true });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ createdAt: 1 });

// Middleware to update class booked count
bookingSchema.pre('save', async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (this.isNew) {
    const YogaClass = mongoose.model('YogaClass');
    await YogaClass.findByIdAndUpdate(this.yogaClass, {
      $inc: { booked: 1 },
    });
  }
  next();
});

// Middleware to update class booked count on deletion
bookingSchema.pre('deleteOne', { document: true }, async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
  const YogaClass = mongoose.model('YogaClass');
  await YogaClass.findByIdAndUpdate(this.yogaClass, {
    $inc: { booked: -1 },
  });
  next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema); 