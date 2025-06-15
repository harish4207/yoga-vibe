import { Request, Response } from 'express';
import UserContentInteraction, { IUserContentInteraction } from '../models/UserContentInteraction';
import { Content } from '../models/Content'; // Assuming you have a Content model
import { IUser } from '../models/User'; // Assuming IUser is exported from User model
import mongoose from 'mongoose';
import * as contentInteractionService from '../services/contentInteractionService';
import { AuthRequest } from '../types/express';

// Helper function to find or create interaction
const findOrCreateInteraction = async (userId: mongoose.Types.ObjectId, contentId: string) => {
  const contentObjectId = new mongoose.Types.ObjectId(contentId);
  let interaction = await UserContentInteraction.findOne({ user: userId, content: contentObjectId });

  if (!interaction) {
    interaction = new UserContentInteraction({ user: userId, content: contentObjectId });
    await interaction.save();
  }
  return interaction;
};

// @desc    Toggle bookmark status for content
// @route   PUT /api/interactions/bookmark/:contentId
// @access  Private (User)
export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { contentId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    // Ensure content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const interaction = await findOrCreateInteraction(
      userId as mongoose.Types.ObjectId,
      contentId
    );

    interaction.bookmarked = !interaction.bookmarked;
    await interaction.save();

    res.status(200).json({ success: true, data: interaction });
  } catch (error: any) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Submit rating for content
// @route   PUT /api/interactions/rate/:contentId
// @access  Private (User)
export const rateContent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { contentId } = req.params;
    const { rating } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Invalid rating value (must be 1-5)' });
    }

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    // Ensure content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const interaction = await findOrCreateInteraction(
      userId as mongoose.Types.ObjectId,
      contentId
    );

    interaction.rating = rating;
    await interaction.save();

    res.status(200).json({ success: true, data: interaction });
  } catch (error: any) {
    console.error('Error rating content:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Submit feedback for content
// @route   PUT /api/interactions/feedback/:contentId
// @access  Private (User)
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { contentId } = req.params;
    const { feedback } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (feedback === undefined || feedback.trim() === '') {
      return res.status(400).json({ success: false, message: 'Feedback cannot be empty' });
    }

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    // Ensure content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const interaction = await findOrCreateInteraction(
      userId as mongoose.Types.ObjectId,
      contentId
    );

    interaction.feedback = feedback.trim();
    await interaction.save();

    res.status(200).json({ success: true, data: interaction });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Mark content as completed
// @route   PUT /api/interactions/complete/:contentId
// @access  Private (User)
export const markCompleted = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { contentId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ success: false, message: 'Invalid content ID' });
    }

    // Ensure content exists
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const interaction = await findOrCreateInteraction(
      userId as mongoose.Types.ObjectId,
      contentId
    );

    interaction.completed = true;
    // Optionally update viewDuration or lastViewedAt here if tracking views
    await interaction.save();

    res.status(200).json({ success: true, data: interaction });
  } catch (error: any) {
    console.error('Error marking content as completed:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get popular content analytics (Admin)
// @route   GET /api/interactions/analytics/popular-content
// @access  Private (Admin)
export const getPopularContent = async (req: Request, res: Response) => {
  try {
    // This is an example aggregation. You can customize it based on what 'popular' means (bookmarks, completion, views, etc.)
    const popularContent = await contentInteractionService.getPopularContent(); // Use service function
    res.status(200).json({ success: true, data: popularContent });
  } catch (error: any) {
    console.error('Error fetching popular content analytics:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get total completed sessions analytics (Admin)
// @route   GET /api/interactions/analytics/total-completed-sessions
// @access  Private (Admin)
export const getTotalCompletedSessions = async (req: Request, res: Response) => {
  try {
    const totalCompleted = await contentInteractionService.getTotalCompletedSessions();
    res.status(200).json({ success: true, data: { total: totalCompleted } });
  } catch (error: any) {
    console.error('Error fetching total completed sessions:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}; 