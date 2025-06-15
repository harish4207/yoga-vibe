import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import SubscriptionPlan from '../models/SubscriptionPlan';
import * as subscriptionController from '../controllers/subscriptionController';

const router = express.Router();

// Get all active subscription plans (public)
router.get('/plans', subscriptionController.getAllPlans);

// Get user's current subscription (user)
router.get('/my-subscription', authenticateJWT, /* TODO: Implement user subscription retrieval route */ (req, res) => {
  res.json({ success: true, message: 'Subscription endpoint not implemented yet' });
});

// Create new subscription plan (admin)
router.post('/plans', authenticateJWT, authorizeRoles(['admin']), subscriptionController.createPlan);

// Update subscription plan (admin)
router.put('/plans/:planId', authenticateJWT, authorizeRoles(['admin']), subscriptionController.updatePlan);

// Delete subscription plan (admin)
router.delete('/plans/:planId', authenticateJWT, authorizeRoles(['admin']), subscriptionController.deletePlan);

export default router; 