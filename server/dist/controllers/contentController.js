"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getContentById = exports.getAllContent = exports.createContent = void 0;
const Content_1 = require("../models/Content");
// Content controller functions
// Create new content
const createContent = async (req, res) => {
    try {
        const newContent = new Content_1.Content(req.body);
        await newContent.save();
        res.status(201).json({ success: true, data: newContent });
    }
    catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createContent = createContent;
// Get all content
const getAllContent = async (req, res) => {
    try {
        const content = await Content_1.Content.find({});
        res.status(200).json({ success: true, data: content });
    }
    catch (error) {
        console.error('Error fetching all content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAllContent = getAllContent;
// Get content by ID
const getContentById = async (req, res) => {
    try {
        const contentItem = await Content_1.Content.findById(req.params.id);
        if (!contentItem) {
            return res.status(404).json({ success: false, error: 'Content not found' });
        }
        res.status(200).json({ success: true, data: contentItem });
    }
    catch (error) {
        console.error('Error fetching content by ID:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getContentById = getContentById;
// Update content
const updateContent = async (req, res) => {
    try {
        const updatedContent = await Content_1.Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedContent) {
            return res.status(404).json({ success: false, error: 'Content not found' });
        }
        res.status(200).json({ success: true, data: updatedContent });
    }
    catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateContent = updateContent;
// Delete content
const deleteContent = async (req, res) => {
    try {
        const deletedContent = await Content_1.Content.findByIdAndDelete(req.params.id);
        if (!deletedContent) {
            return res.status(404).json({ success: false, error: 'Content not found' });
        }
        res.status(200).json({ success: true, message: 'Content deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteContent = deleteContent;
