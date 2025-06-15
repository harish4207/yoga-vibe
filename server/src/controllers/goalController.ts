import { Request, Response } from 'express';
import UserGoal from '../models/UserGoal';
import { IUser } from '../models/User'; // Assuming IUser is exported from User model

// @desc    Get user goals
// @route   GET /api/goals/my-goals
// @access  Private
export const getUserGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userGoals = await UserGoal.findOne({ userId });

    if (!userGoals) {
      // Create a default entry if none exists
      const newUserGoals = new UserGoal({ userId, goals: [], preferences: {} });
      await newUserGoals.save();
      return res.status(200).json({ success: true, data: newUserGoals });
    }

    res.status(200).json({ success: true, data: userGoals });
  } catch (error: any) {
    console.error('Error fetching user goals:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update user goals
// @route   PUT /api/goals/my-goals
// @access  Private
export const updateUserGoals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { goals, preferences } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const userGoals = await UserGoal.findOneAndUpdate(
      { userId },
      { goals, preferences },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: userGoals });
  } catch (error: any) {
    console.error('Error updating user goals:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// TODO: Add controller for admin to view/edit all user goals 