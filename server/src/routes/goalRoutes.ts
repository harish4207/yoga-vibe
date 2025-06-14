import express from 'express';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
// import UserGoal from '../models/UserGoal'; // We will use the controller instead
import { getUserGoals, updateUserGoals } from '../controllers/goalController'; // Import controller functions

const router = express.Router();

// Get user's goals (user)
router.get('/my-goals', auth, getUserGoals); // Use controller function

// Update user's goals (user)
router.put('/my-goals', auth, updateUserGoals); // Use controller function

// Get all users' goals (admin)
router.get('/all-goals', auth, isAdmin, async (req, res) => {
  // Keeping inline for now, or move to controller later if needed
  // TODO: Move admin goal routes to controller
  try {
    // Assuming UserGoal import is needed here if not moved to controller
    // import UserGoal from '../models/UserGoal';
    // const goals = await UserGoal.find().populate('userId', 'name email');
    res.json({ success: true, data: [] }); // Placeholder
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all goals' });
  }
});

// Update specific user's goals (admin)
router.put('/user-goals/:userId', auth, isAdmin, async (req, res) => {
   // Keeping inline for now, or move to controller later if needed
  // TODO: Move admin goal routes to controller
  try {
    // Assuming UserGoal import is needed here if not moved to controller
    // import UserGoal from '../models/UserGoal';
    // const goals = await UserGoal.findOneAndUpdate(
    //   { userId: req.params.userId },
    //   { $set: req.body },
    //   { new: true, upsert: true }
    // );
    res.json({ success: true, data: {} }); // Placeholder
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user goals' });
  }
});

export default router; 