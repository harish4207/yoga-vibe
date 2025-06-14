import { Request, Response, NextFunction } from 'express';
import * as chatService from '../services/chatService';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { message } = req.body;
        const userId = (req as any).user.id;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Message is required and must be a non-empty string'
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const response = await chatService.processMessage(message, userId);
        
        res.status(200).json({
            success: true,
            message: response
        });
    } catch (err) {
        console.error('Chat error:', err);
        next(err);
    }
};

console.log('chatController.sendMessage loaded:', typeof sendMessage); 