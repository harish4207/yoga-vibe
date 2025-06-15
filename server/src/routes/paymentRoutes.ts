import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

// Create payment order
router.post('/create-order', authenticateJWT, paymentController.createPaymentOrder);

// Create subscription order
router.post('/create-subscription-order', authenticateJWT, paymentController.createSubscriptionOrder);

// Verify payment
router.post('/verify', authenticateJWT, paymentController.verifyPayment);

// Webhook endpoint (no authentication needed as it's called by Razorpay)
router.post('/webhook', paymentController.handleWebhook);

// Get payment history
router.get('/history', authenticateJWT, paymentController.getPaymentHistory);

// Get payment details
router.get('/:id', authenticateJWT, paymentController.getPaymentById);

export default router; 