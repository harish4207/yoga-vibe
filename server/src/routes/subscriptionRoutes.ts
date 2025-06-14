import express from 'express';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import SubscriptionPlan from '../models/SubscriptionPlan';
import * as subscriptionController from '../controllers/subscriptionController';

const router = express.Router();

// Get all active subscription plans (public)
router.get('/plans', subscriptionController.getAllPlans);

// Get user's current subscription (user)
router.get('/my-subscription', auth, /* TODO: Implement user subscription retrieval route */ (req, res) => {
  res.json({ success: true, message: 'Subscription endpoint not implemented yet' });
});

// Create new subscription plan (admin)
router.post('/plans', auth, isAdmin, subscriptionController.createPlan);

// Update subscription plan (admin)
router.put('/plans/:planId', auth, isAdmin, subscriptionController.updatePlan);

// Delete subscription plan (admin)
router.delete('/plans/:planId', auth, isAdmin, subscriptionController.deletePlan);

export default router; 