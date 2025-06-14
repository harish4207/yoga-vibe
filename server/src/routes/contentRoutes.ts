import { Router } from 'express';
import * as contentController from '../controllers/contentController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

console.log('Content Controller imported in routes:', contentController);

// Public route to get all content (e.g., for user dashboard)
router.get('/content', contentController.getAllContent);

// Admin routes for content management
router.post('/content', authenticateJWT, authorizeRoles(['admin']), contentController.createContent);
router.get('/content/:id', authenticateJWT, authorizeRoles(['admin']), contentController.getContentById);
router.put('/content/:id', authenticateJWT, authorizeRoles(['admin']), contentController.updateContent);
router.delete('/content/:id', authenticateJWT, authorizeRoles(['admin']), contentController.deleteContent);

export default router; 