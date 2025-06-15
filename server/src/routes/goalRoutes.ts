import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import { getUserGoals, updateUserGoals } from '../controllers/goalController';

const router = express.Router();

// Get user's goals (user)
router.get('/my-goals', authenticateJWT, getUserGoals);

// Update user's goals (user)
router.put('/my-goals', authenticateJWT, updateUserGoals);

// Get all users' goals (admin)
router.get('/all-goals', authenticateJWT, authorizeRoles(['admin']), async (req, res) => {
  try {
    res.json({ success: true, data: [] }); // Placeholder
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all goals' });
  }
});

// Update specific user's goals (admin)
router.put('/user-goals/:userId', authenticateJWT, authorizeRoles(['admin']), async (req, res) => {
  try {
    res.json({ success: true, data: {} }); // Placeholder
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user goals' });
  }
});

export default router; 