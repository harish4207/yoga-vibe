import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import {
  toggleBookmark,
  rateContent,
  submitFeedback,
  markCompleted,
  getPopularContent,
  getTotalCompletedSessions
} from '../controllers/contentInteractionController';

const router = express.Router();

// User Interaction Routes (Private - User)
router.put('/bookmark/:contentId', authenticateJWT, toggleBookmark);
router.put('/rate/:contentId', authenticateJWT, rateContent);
router.put('/feedback/:contentId', authenticateJWT, submitFeedback);
router.put('/complete/:contentId', authenticateJWT, markCompleted);

// Admin Analytics Routes (Private - Admin)
router.get('/analytics/popular-content', authenticateJWT, authorizeRoles(['admin']), getPopularContent);
router.get('/analytics/total-completed-sessions', authenticateJWT, authorizeRoles(['admin']), getTotalCompletedSessions);

export default router; 