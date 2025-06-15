"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserGoals = exports.getUserGoals = void 0;
const UserGoal_1 = __importDefault(require("../models/UserGoal"));
// @desc    Get user goals
// @route   GET /api/goals/my-goals
// @access  Private
const getUserGoals = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const userGoals = await UserGoal_1.default.findOne({ userId });
        if (!userGoals) {
            // Create a default entry if none exists
            const newUserGoals = new UserGoal_1.default({ userId, goals: [], preferences: {} });
            await newUserGoals.save();
            return res.status(200).json({ success: true, data: newUserGoals });
        }
        res.status(200).json({ success: true, data: userGoals });
    }
    catch (error) {
        console.error('Error fetching user goals:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getUserGoals = getUserGoals;
// @desc    Update user goals
// @route   PUT /api/goals/my-goals
// @access  Private
const updateUserGoals = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { goals, preferences } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const userGoals = await UserGoal_1.default.findOneAndUpdate({ userId }, { goals, preferences }, { new: true, upsert: true, setDefaultsOnInsert: true });
        res.status(200).json({ success: true, data: userGoals });
    }
    catch (error) {
        console.error('Error updating user goals:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.updateUserGoals = updateUserGoals;
// TODO: Add controller for admin to view/edit all user goals 
