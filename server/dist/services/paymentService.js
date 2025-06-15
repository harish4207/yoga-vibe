"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getPaymentHistory = exports.handleRazorpayWebhook = exports.createSubscriptionOrder = exports.createPaymentOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = require("../config");
const Payment_1 = __importDefault(require("../models/Payment"));
const Class_1 = __importDefault(require("../models/Class"));
const User_1 = require("../models/User");
const crypto_1 = __importDefault(require("crypto"));
const Subscription_1 = require("../models/Subscription");
const SubscriptionPlan_1 = __importDefault(require("../models/SubscriptionPlan"));
const razorpay = new razorpay_1.default({
    key_id: config_1.config.razorpay.keyId,
    key_secret: config_1.config.razorpay.keySecret,
});
// Create a payment order for a class
const createPaymentOrder = async (userId, classId) => {
    const yogaClass = await Class_1.default.findById(classId);
    if (!yogaClass) {
        throw new Error('Class not found');
    }
    const user = await User_1.User.findById(userId);
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
    const payment = new Payment_1.default({
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
exports.createPaymentOrder = createPaymentOrder;
// Create a payment order for a subscription
const createSubscriptionOrder = async (planId, amount, currency, billingCycle, userId) => {
    const user = await User_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Check for existing subscription and delete it to avoid duplicate key error
    const existingSubscription = await Subscription_1.Subscription.findOne({ user: userId });
    if (existingSubscription) {
        await Subscription_1.Subscription.deleteOne({ _id: existingSubscription._id });
        console.log(`Deleted existing subscription for user ${userId}: ${existingSubscription._id}`);
    }
    // Fetch the subscription plan from the database using its MongoDB _id
    const subscriptionPlan = await SubscriptionPlan_1.default.findById(planId);
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
    }
    else {
        endDate.setFullYear(endDate.getFullYear() + 1);
    }
    // Create Razorpay order
    const order = await razorpay.orders.create({
        amount: actualAmount * 100, // Use the actualAmount from the fetched plan and convert to paise
        currency,
        receipt: `subscription_receipt_${Date.now()}`,
        notes: {
            planId: subscriptionPlan._id, // Use the actual plan _id, cast to string
            userId: userId,
            billingCycle: billingCycle,
        },
    });
    // Create a new subscription record in the database
    const subscription = new Subscription_1.Subscription({
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
exports.createSubscriptionOrder = createSubscriptionOrder;
// Handle Razorpay webhook events
const handleRazorpayWebhook = async (payload, signature) => {
    const expectedSignature = crypto_1.default
        .createHmac('sha256', config_1.config.razorpay.keySecret)
        .update(JSON.stringify(payload))
        .digest('hex');
    if (expectedSignature !== signature) {
        throw new Error('Invalid signature');
    }
    const { payload: { payment: { entity: payment } } } = payload;
    const dbPayment = await Payment_1.default.findOne({
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
        const yogaClass = await Class_1.default.findById(dbPayment.class);
        if (yogaClass) {
            yogaClass.enrolledStudents.push(dbPayment.user);
            await yogaClass.save();
        }
    }
    else if (payment.status === 'failed') {
        dbPayment.status = 'failed';
        await dbPayment.save();
    }
};
exports.handleRazorpayWebhook = handleRazorpayWebhook;
// Get payment history for a user
const getPaymentHistory = async (userId) => {
    return Payment_1.default.find({ user: userId })
        .populate('class')
        .sort({ createdAt: -1 });
};
exports.getPaymentHistory = getPaymentHistory;
// Get payment by ID
const getPaymentById = async (paymentId) => {
    return Payment_1.default.findById(paymentId)
        .populate('class')
        .populate('user', 'name email');
};
exports.getPaymentById = getPaymentById;
