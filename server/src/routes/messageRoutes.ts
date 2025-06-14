import express from 'express';
import * as messageController from '../controllers/messageController';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// Route to submit a new message (public, no authentication needed initially)
router.post('/contact', messageController.createMessage);

// Route to get all messages (Admin only)
router.get('/contact', authenticateJWT, authorizeRoles('admin'), messageController.getAllMessages);

export default router; 