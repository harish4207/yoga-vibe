"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalCompletedSessions = exports.getPopularContent = exports.markCompleted = exports.submitFeedback = exports.rateContent = exports.toggleBookmark = void 0;
const UserContentInteraction_1 = __importDefault(require("../models/UserContentInteraction"));
const Content_1 = require("../models/Content"); // Assuming you have a Content model
const mongoose_1 = __importDefault(require("mongoose"));
const contentInteractionService = __importStar(require("../services/contentInteractionService"));
// Helper function to find or create interaction
const findOrCreateInteraction = async (userId, contentId) => {
    const contentObjectId = new mongoose_1.default.Types.ObjectId(contentId);
    let interaction = await UserContentInteraction_1.default.findOne({ user: userId, content: contentObjectId });
    if (!interaction) {
        interaction = new UserContentInteraction_1.default({ user: userId, content: contentObjectId });
        await interaction.save();
    }
    return interaction;
};
// @desc    Toggle bookmark status for content
// @route   PUT /api/interactions/bookmark/:contentId
// @access  Private (User)
const toggleBookmark = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { contentId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ success: false, message: 'Invalid content ID' });
        }
        // Ensure content exists
        const content = await Content_1.Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        const interaction = await findOrCreateInteraction(userId, contentId);
        interaction.bookmarked = !interaction.bookmarked;
        await interaction.save();
        res.status(200).json({ success: true, data: interaction });
    }
    catch (error) {
        console.error('Error toggling bookmark:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.toggleBookmark = toggleBookmark;
// @desc    Submit rating for content
// @route   PUT /api/interactions/rate/:contentId
// @access  Private (User)
const rateContent = async (req, res) => {
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
        if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ success: false, message: 'Invalid content ID' });
        }
        // Ensure content exists
        const content = await Content_1.Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        const interaction = await findOrCreateInteraction(userId, contentId);
        interaction.rating = rating;
        await interaction.save();
        res.status(200).json({ success: true, data: interaction });
    }
    catch (error) {
        console.error('Error rating content:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.rateContent = rateContent;
// @desc    Submit feedback for content
// @route   PUT /api/interactions/feedback/:contentId
// @access  Private (User)
const submitFeedback = async (req, res) => {
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
        if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ success: false, message: 'Invalid content ID' });
        }
        // Ensure content exists
        const content = await Content_1.Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        const interaction = await findOrCreateInteraction(userId, contentId);
        interaction.feedback = feedback.trim();
        await interaction.save();
        res.status(200).json({ success: true, data: interaction });
    }
    catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.submitFeedback = submitFeedback;
// @desc    Mark content as completed
// @route   PUT /api/interactions/complete/:contentId
// @access  Private (User)
const markCompleted = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { contentId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        if (!contentId || !mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            return res.status(400).json({ success: false, message: 'Invalid content ID' });
        }
        // Ensure content exists
        const content = await Content_1.Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        const interaction = await findOrCreateInteraction(userId, contentId);
        interaction.completed = true;
        // Optionally update viewDuration or lastViewedAt here if tracking views
        await interaction.save();
        res.status(200).json({ success: true, data: interaction });
    }
    catch (error) {
        console.error('Error marking content as completed:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.markCompleted = markCompleted;
// @desc    Get popular content analytics (Admin)
// @route   GET /api/interactions/analytics/popular-content
// @access  Private (Admin)
const getPopularContent = async (req, res) => {
    try {
        // This is an example aggregation. You can customize it based on what 'popular' means (bookmarks, completion, views, etc.)
        const popularContent = await contentInteractionService.getPopularContent(); // Use service function
        res.status(200).json({ success: true, data: popularContent });
    }
    catch (error) {
        console.error('Error fetching popular content analytics:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getPopularContent = getPopularContent;
// @desc    Get total completed sessions analytics (Admin)
// @route   GET /api/interactions/analytics/total-completed-sessions
// @access  Private (Admin)
const getTotalCompletedSessions = async (req, res) => {
    try {
        const totalCompleted = await contentInteractionService.getTotalCompletedSessions();
        res.status(200).json({ success: true, data: { total: totalCompleted } });
    }
    catch (error) {
        console.error('Error fetching total completed sessions:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getTotalCompletedSessions = getTotalCompletedSessions;
