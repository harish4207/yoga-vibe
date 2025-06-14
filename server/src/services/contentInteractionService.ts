import UserContentInteraction, { IUserContentInteraction } from '../models/UserContentInteraction';
import mongoose from 'mongoose';

export const createOrUpdateInteraction = async (userId: string, contentId: string, interactionData: Partial<IUserContentInteraction>): Promise<IUserContentInteraction | null> => {
  try {
    const interaction = await UserContentInteraction.findOneAndUpdate(
      { user: userId, content: contentId },
      { $set: interactionData },
      { upsert: true, new: true }
    );
    return interaction;
  } catch (error) {
    console.error('Error creating or updating content interaction:', error);
    throw error;
  }
};

export const getInteraction = async (userId: string, contentId: string): Promise<IUserContentInteraction | null> => {
  try {
    const interaction = await UserContentInteraction.findOne({ user: userId, content: contentId });
    return interaction;
  } catch (error) {
    console.error('Error fetching content interaction:', error);
    throw error;
  }
};

export const getInteractionsByUser = async (userId: string): Promise<IUserContentInteraction[]> => {
  try {
    const interactions = await UserContentInteraction.find({ user: userId });
    return interactions;
  } catch (error) {
    console.error('Error fetching content interactions by user:', error);
    throw error;
  }
};

export const getPopularContent = async (limit: number = 10): Promise<any[]> => {
  try {
    const popularContent = await UserContentInteraction.aggregate([
      { $match: { isBookmarked: true } }, // Assuming popular content is based on bookmarks
      { $group: { _id: '$content', bookmarkCount: { $sum: 1 } } },
      { $sort: { bookmarkCount: -1 } },
      { $limit: limit },
      { $lookup: { from: 'contents', localField: '_id', foreignField: '_id', as: 'contentDetails' } },
      { $unwind: '$contentDetails' },
      { $project: { _id: 0, content: '$contentDetails', bookmarkCount: 1 } }
    ]);
    return popularContent;
  } catch (error) {
    console.error('Error fetching popular content:', error);
    throw error;
  }
};

// New function to calculate total completed sessions
export const getTotalCompletedSessions = async (): Promise<number> => {
  try {
    const result = await UserContentInteraction.aggregate([
      { $match: { isCompleted: true } },
      { $count: 'totalCompleted' }
    ]);
    return result.length > 0 ? result[0].totalCompleted : 0;
  } catch (error) {
    console.error('Error calculating total completed sessions:', error);
    throw error;
  }
}; 