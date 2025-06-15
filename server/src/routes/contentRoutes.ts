import { Router } from 'express';
import * as contentController from '../controllers/contentController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';

const router = Router();

console.log('Content Controller imported in routes:', contentController);

// Public route to get all content (e.g., for user dashboard)
router.get('/', contentController.getAllContent);

// Admin routes for content management
router.post('/', authenticateJWT, authorizeRoles(['admin']), contentController.createContent);
router.get('/:id', authenticateJWT, authorizeRoles(['admin']), contentController.getContentById);
router.put('/:id', authenticateJWT, authorizeRoles(['admin']), contentController.updateContent);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin']), contentController.deleteContent);

export default router; 