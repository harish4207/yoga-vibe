import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import * as chatController from '../controllers/chatController';

const router = express.Router();

router.post('/chat', authenticateJWT, chatController.sendMessage);

export default router; 