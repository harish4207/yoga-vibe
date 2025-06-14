import { Request, Response } from 'express';
import crypto from 'crypto';
import { YogaClass } from '../models/YogaClass';
import { User } from '../models/User';
import * as classService from '../services/classService';
import * as paymentService from '../services/paymentService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

// Create a payment order for a class
export const createPaymentOrder = async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error creating payment order',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a payment order for a subscription
export const createSubscriptionOrder = async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error) {
    console.error("Error in createSubscriptionOrder:", error);
    res.status(400).json({
      success: false,
      error: 'Error creating subscription order',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Verify payment and handle webhook
export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      classId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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
    const yogaClass = await YogaClass.findById(classId);
    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    const userId = new mongoose.Types.ObjectId(req.user!.id);

    // Add user to enrolled students
    if (!yogaClass.enrolledStudents.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
      yogaClass.enrolledStudents.push(userId);
      await yogaClass.save();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error verifying payment',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Handle Razorpay webhook
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
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
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      error: 'Error processing webhook',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Helper functions for webhook handling
const handleSuccessfulPayment = async (payload: any) => {
  const { notes } = payload.payment.entity;
  const { classId, userId } = notes;

  const yogaClass = await YogaClass.findById(classId);
  if (yogaClass) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!yogaClass.enrolledStudents.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId))) {
      yogaClass.enrolledStudents.push(userObjectId);
      await yogaClass.save();
    }
  }
};

const handleFailedPayment = async (payload: any) => {
  // Handle failed payment logic
  console.log('Payment failed:', payload);
};

// Get payment history for the authenticated user
export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching payment history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get payment details by ID
export const getPaymentById = async (req: AuthenticatedRequest, res: Response) => {
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
    if (
      payment.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this payment',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching payment details',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 