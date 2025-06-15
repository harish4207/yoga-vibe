import { Request, Response } from 'express';
import { Content, IContent } from '../models/Content';

// Content controller functions

// Create new content
export const createContent = async (req: Request, res: Response) => {
  try {
    const newContent = new Content(req.body);
    await newContent.save();
    res.status(201).json({ success: true, data: newContent });
  } catch (error: any) {
    console.error('Error creating content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all content
export const getAllContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.find({});
    res.status(200).json({ success: true, data: content });
  } catch (error: any) {
    console.error('Error fetching all content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get content by ID
export const getContentById = async (req: Request, res: Response) => {
  try {
    const contentItem = await Content.findById(req.params.id);
    if (!contentItem) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }
    res.status(200).json({ success: true, data: contentItem });
  } catch (error: any) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update content
export const updateContent = async (req: Request, res: Response) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedContent) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }
    res.status(200).json({ success: true, data: updatedContent });
  } catch (error: any) {
    console.error('Error updating content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete content
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);
    if (!deletedContent) {
      return res.status(404).json({ success: false, error: 'Content not found' });
    }
    res.status(200).json({ success: true, message: 'Content deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting content:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}; 