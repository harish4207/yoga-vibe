import Razorpay from 'razorpay';
import { config } from '../config';
import Payment, { IPayment } from '../models/Payment';
import Class, { IClass } from '../models/Class';
import { User } from '../models/User';
import crypto from 'crypto';
import { Subscription } from '../models/Subscription';
import SubscriptionPlan, { ISubscriptionPlan } from '../models/SubscriptionPlan';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Create a payment order for a class
export const createPaymentOrder = async (userId: string, classId: string) => {
  const yogaClass = await Class.findById(classId);
  if (!yogaClass) {
    throw new Error('Class not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: yogaClass.price * 100, // Razorpay expects amount in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: {
      classId: classId,
      userId: userId,
    },
  });

  // Create payment record
  const payment = new Payment({
    user: userId,
    class: classId,
    amount: yogaClass.price,
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'razorpay',
    razorpayOrderId: order.id,
    description: `Payment for ${yogaClass.title} class`,
  });

  await payment.save();

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    paymentId: payment._id,
  };
};

// Create a payment order for a subscription
export const createSubscriptionOrder = async (
  planId: string,
  amount: number,
  currency: string,
  billingCycle: 'monthly' | 'yearly',
  userId: string
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check for existing subscription and delete it to avoid duplicate key error
  const existingSubscription = await Subscription.findOne({ user: userId });
  if (existingSubscription) {
    await Subscription.deleteOne({ _id: existingSubscription._id });
    console.log(`Deleted existing subscription for user ${userId}: ${existingSubscription._id}`);
  }

  // Fetch the subscription plan from the database using its MongoDB _id
  const subscriptionPlan: ISubscriptionPlan | null = await SubscriptionPlan.findById(planId);
  if (!subscriptionPlan) {
    throw new Error('Subscription plan not found');
  }

  // Determine the actual amount based on billing cycle from the fetched plan
  const actualAmount = billingCycle === 'monthly' ? subscriptionPlan.monthlyPrice : subscriptionPlan.yearlyPrice;

  console.log('Subscription Plan fetched:', subscriptionPlan);
  console.log('Billing Cycle:', billingCycle);
  console.log('Calculated Actual Amount:', actualAmount);

  // Calculate end date for the subscription
  const startDate = new Date();
  let endDate = new Date(startDate);
  if (billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: actualAmount * 100, // Use the actualAmount from the fetched plan and convert to paise
    currency,
    receipt: `subscription_receipt_${Date.now()}`,
    notes: {
      planId: subscriptionPlan._id as string, // Use the actual plan _id, cast to string
      userId: userId,
      billingCycle: billingCycle,
    },
  });

  // Create a new subscription record in the database
  const subscription = new Subscription({
    user: userId,
    plan: 'basic', // Hardcoding to 'basic' to match enum, as 'sera fw' is not a valid enum value
    status: 'active',
    startDate: startDate,
    endDate: endDate,
    autoRenew: true, // Default to true, can be changed by user later
    paymentId: order.id,
  });
  await subscription.save();

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    subscriptionId: subscription._id, // Return the newly created subscription ID
  };
};

// Handle Razorpay webhook events
export const handleRazorpayWebhook = async (payload: any, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  const { payload: { payment: { entity: payment } } } = payload;

  const dbPayment = await Payment.findOne({
    razorpayOrderId: payment.order_id,
  });

  if (!dbPayment) {
    throw new Error('Payment not found');
  }

  if (payment.status === 'captured') {
    dbPayment.status = 'completed';
    dbPayment.razorpayPaymentId = payment.id;
    await dbPayment.save();

    // Update class enrollment
    const yogaClass = await Class.findById(dbPayment.class);
    if (yogaClass) {
      yogaClass.enrolledStudents.push(dbPayment.user);
      await yogaClass.save();
    }
  } else if (payment.status === 'failed') {
    dbPayment.status = 'failed';
    await dbPayment.save();
  }
};

// Get payment history for a user
export const getPaymentHistory = async (userId: string) => {
  return Payment.find({ user: userId })
    .populate('class')
    .sort({ createdAt: -1 });
};

// Get payment by ID
export const getPaymentById = async (paymentId: string) => {
  return Payment.findById(paymentId)
    .populate('class')
    .populate('user', 'name email');
}; 