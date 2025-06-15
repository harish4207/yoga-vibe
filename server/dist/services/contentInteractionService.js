"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalCompletedSessions = exports.getPopularContent = exports.getInteractionsByUser = exports.getInteraction = exports.createOrUpdateInteraction = void 0;
const UserContentInteraction_1 = __importDefault(require("../models/UserContentInteraction"));
const createOrUpdateInteraction = async (userId, contentId, interactionData) => {
    try {
        const interaction = await UserContentInteraction_1.default.findOneAndUpdate({ user: userId, content: contentId }, { $set: interactionData }, { upsert: true, new: true });
        return interaction;
    }
    catch (error) {
        console.error('Error creating or updating content interaction:', error);
        throw error;
    }
};
exports.createOrUpdateInteraction = createOrUpdateInteraction;
const getInteraction = async (userId, contentId) => {
    try {
        const interaction = await UserContentInteraction_1.default.findOne({ user: userId, content: contentId });
        return interaction;
    }
    catch (error) {
        console.error('Error fetching content interaction:', error);
        throw error;
    }
};
exports.getInteraction = getInteraction;
const getInteractionsByUser = async (userId) => {
    try {
        const interactions = await UserContentInteraction_1.default.find({ user: userId });
        return interactions;
    }
    catch (error) {
        console.error('Error fetching content interactions by user:', error);
        throw error;
    }
};
exports.getInteractionsByUser = getInteractionsByUser;
const getPopularContent = async (limit = 10) => {
    try {
        const popularContent = await UserContentInteraction_1.default.aggregate([
            { $match: { isBookmarked: true } }, // Assuming popular content is based on bookmarks
            { $group: { _id: '$content', bookmarkCount: { $sum: 1 } } },
            { $sort: { bookmarkCount: -1 } },
            { $limit: limit },
            { $lookup: { from: 'contents', localField: '_id', foreignField: '_id', as: 'contentDetails' } },
            { $unwind: '$contentDetails' },
            { $project: { _id: 0, content: '$contentDetails', bookmarkCount: 1 } }
        ]);
        return popularContent;
    }
    catch (error) {
        console.error('Error fetching popular content:', error);
        throw error;
    }
};
exports.getPopularContent = getPopularContent;
// New function to calculate total completed sessions
const getTotalCompletedSessions = async () => {
    try {
        const result = await UserContentInteraction_1.default.aggregate([
            { $match: { isCompleted: true } },
            { $count: 'totalCompleted' }
        ]);
        return result.length > 0 ? result[0].totalCompleted : 0;
    }
    catch (error) {
        console.error('Error calculating total completed sessions:', error);
        throw error;
    }
};
exports.getTotalCompletedSessions = getTotalCompletedSessions;
