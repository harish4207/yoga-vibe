import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', authenticateJWT, authController.getProfile);
router.put('/profile', authenticateJWT, authController.updateProfile);
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
// router.post('/google/callback', authController.googleAuthCallback); // Commented out to avoid conflict with Passport.js GET callback
router.post('/verify-otp', authController.verifyOtp);
router.post('/upload-profile-picture', authenticateJWT, upload.single('profilePicture'), authController.uploadProfilePicture);
router.get('/users', authenticateJWT, authController.getAllUsers);

export default router; 