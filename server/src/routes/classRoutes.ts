import { Router } from 'express';
import * as classController from '../controllers/classController';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public: get all classes, get class by id
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);

// Protected: create, update, delete (admin/instructor only)
router.post('/', authenticateJWT, classController.createClass);
router.put('/:id', authenticateJWT, authorizeRoles(['admin', 'instructor']), classController.updateClass);
// router.put('/:id/image', authenticateJWT, authorizeRoles(['admin', 'instructor']), upload.single('classImage'), classController.uploadClassImage);
router.delete('/:id', authenticateJWT, authorizeRoles(['admin', 'instructor']), classController.deleteClass);

// Protected: enrollment endpoints (authenticated users)
router.post('/:id/enroll', authenticateJWT, classController.enrollInClass);
router.delete('/:id/enroll', authenticateJWT, classController.unenrollFromClass);

export default router; 