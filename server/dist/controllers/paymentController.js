"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentById = exports.getPaymentHistory = exports.handleWebhook = exports.verifyPayment = exports.createSubscriptionOrder = exports.createPaymentOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const YogaClass_1 = require("../models/YogaClass");
const classService = __importStar(require("../services/classService"));
const paymentService = __importStar(require("../services/paymentService"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create a payment order for a class
const createPaymentOrder = async (req, res) => {
    try {
        const { classId } = req.body;
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }
        const order = await classService.createOrder(classId, req.user.id);
        res.json({
            success: true,
            data: {
                orderId: order.orderId,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error creating payment order',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createPaymentOrder = createPaymentOrder;
// Create a payment order for a subscription
const createSubscriptionOrder = async (req, res) => {
    try {
        const { planId, amount, currency, billingCycle } = req.body;
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }
        // Here you would integrate with Razorpay or your payment gateway
        // to create a subscription order based on the planId, amount, etc.
        // For now, let's simulate a successful order creation.
        const order = await paymentService.createSubscriptionOrder(planId, amount, currency, billingCycle, req.user.id);
        res.json({
            success: true,
            data: {
                orderId: order.orderId,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            },
        });
    }
    catch (error) {
        console.error("Error in createSubscriptionOrder:", error);
        res.status(400).json({
            success: false,
            error: 'Error creating subscription order',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createSubscriptionOrder = createSubscriptionOrder;
// Verify payment and handle webhook
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, classId, } = req.body;
        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");
        const isAuthentic = expectedSignature === razorpay_signature;
        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment signature',
            });
        }
        // Update class enrollment
        const yogaClass = await YogaClass_1.YogaClass.findById(classId);
        if (!yogaClass) {
            return res.status(404).json({
                success: false,
                error: 'Class not found',
            });
        }
        const userId = new mongoose_1.default.Types.ObjectId(req.user.id);
        // Add user to enrolled students
        if (!yogaClass.enrolledStudents.some((id) => id.equals(userId))) {
            yogaClass.enrolledStudents.push(userId);
            await yogaClass.save();
        }
        res.json({
            success: true,
            message: 'Payment verified successfully',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error verifying payment',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.verifyPayment = verifyPayment;
// Handle Razorpay webhook
const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        if (signature !== expectedSignature) {
            return res.status(400).json({
                success: false,
                error: 'Invalid webhook signature',
            });
        }
        const { payload } = req.body;
        // Handle different webhook events
        switch (payload.payment.entity.status) {
            case 'captured':
                // Payment successful
                await handleSuccessfulPayment(payload);
                break;
            case 'failed':
                // Payment failed
                await handleFailedPayment(payload);
                break;
            // Add more cases as needed
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({
            success: false,
            error: 'Error processing webhook',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.handleWebhook = handleWebhook;
// Helper functions for webhook handling
const handleSuccessfulPayment = async (payload) => {
    const { notes } = payload.payment.entity;
    const { classId, userId } = notes;
    const yogaClass = await YogaClass_1.YogaClass.findById(classId);
    if (yogaClass) {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        if (!yogaClass.enrolledStudents.some((id) => id.equals(userObjectId))) {
            yogaClass.enrolledStudents.push(userObjectId);
            await yogaClass.save();
        }
    }
};
const handleFailedPayment = async (payload) => {
    // Handle failed payment logic
    console.log('Payment failed:', payload);
};
// Get payment history for the authenticated user
const getPaymentHistory = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }
        const payments = await paymentService.getPaymentHistory(req.user.id);
        res.json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching payment history',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getPaymentHistory = getPaymentHistory;
// Get payment details by ID
const getPaymentById = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated',
            });
        }
        const payment = await paymentService.getPaymentById(req.params.id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found',
            });
        }
        // Check if user is authorized to view this payment
        if (payment.user._id.toString() !== req.user.id &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this payment',
            });
        }
        res.json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching payment details',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getPaymentById = getPaymentById;
