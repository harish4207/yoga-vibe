import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { User } from '../models/User';

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

const SYSTEM_PROMPT = `You are a helpful yoga assistant for a yoga platform. Your role is to:
1. Answer questions about yoga, meditation, and wellness
2. Provide information about yoga classes and schedules
3. Help users with their yoga journey
4. Offer guidance on yoga poses and techniques
5. Share mindfulness and meditation tips

Keep your responses concise, friendly, and informative. If you're not sure about something, it's okay to say so.`;

const API_KEY = 'AIzaSyBfvESFnh__CZzbMp6iQxqKTXPYCaLeCIQ';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const processMessage = async (message: string, userId: string): Promise<string> => {
    try {
        // Get user context if needed
        const user = await User.findById(userId);
        const userContext = user ? `User: ${user.name}, Yoga Level: ${user.yogaLevel || 'Not specified'}` : '';

        const headers = {
            'Content-Type': 'application/json'
        };

        const body = {
            contents: [
                {
                    parts: [
                        {
                            text: `${SYSTEM_PROMPT}\n\n${userContext}\n\nUser message: ${message}`
                        }
                    ]
                }
            ]
        };

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }

        const data = await response.json() as GeminiResponse;
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error processing message with Gemini:', error);
        throw new Error('Failed to process message with Gemini API');
    }
};