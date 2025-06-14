import express from 'express';
import { auth } from '../middleware/auth'; // Assuming auth middleware is in this path
import { isAdmin } from '../middleware/isAdmin'; // Assuming isAdmin middleware is in this path
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
router.put('/bookmark/:contentId', auth, toggleBookmark);
router.put('/rate/:contentId', auth, rateContent);
router.put('/feedback/:contentId', auth, submitFeedback);
router.put('/complete/:contentId', auth, markCompleted);

// Admin Analytics Routes (Private - Admin)
router.get('/analytics/popular-content', auth, isAdmin, getPopularContent);
router.get('/analytics/total-completed-sessions', auth, isAdmin, getTotalCompletedSessions);

export default router; 