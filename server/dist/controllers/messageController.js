"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMessages = exports.createMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
// Create a new message from the contact form
const createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields (name, email, subject, message)',
            });
        }
        const newMessage = new Message_1.default({
            name,
            email,
            subject,
            message,
        });
        await newMessage.save();
        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: newMessage,
        });
    }
    catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.createMessage = createMessage;
// Get all messages (Admin only)
const getAllMessages = async (req, res) => {
    try {
        const messages = await Message_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: messages,
        });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
exports.getAllMessages = getAllMessages;
