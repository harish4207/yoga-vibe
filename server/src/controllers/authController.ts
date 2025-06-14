import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string; // Optional profile picture URL
  // Add other fields if needed from Google's user info response
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties you might need from the result
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Login request received:', {
      body: req.body,
      headers: req.headers,
      path: req.path,
      method: req.method
    });
    
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    const { user, token } = await authService.login(req.body);
    console.log('Login successful for user:', user.email);
    
    res.status(200).json({ 
      success: true, 
      user, 
      token 
    });
  } catch (err: any) {
    console.error('Login error:', err);
    if (err.message === 'Invalid credentials') {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    } else if (err.message.includes('Email not verified')) {
      res.status(403).json({ 
        success: false, 
        message: err.message 
      });
    } else {
      console.error('Unexpected login error:', err);
      res.status(500).json({ 
        success: false, 
        message: 'An unexpected error occurred during login' 
      });
    }
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    console.log('AuthController.getProfile: User ID from token:', userId);
    const user = await authService.getProfile(userId);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('AuthConroller.getProfile: Error fetching profile:', err);
    next(err);
  }
};

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.requestPasswordReset(req.body.email);
    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;

    // Temporary logging to check environment variables
    console.log('Backend GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Backend GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
    console.log('Backend GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
    // End of temporary logging

    // Initialize Google OAuth2 client
    if (!config.google) {
      throw new Error('Google OAuth configuration is missing.');
    }

    const client = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );

    // Exchange authorization code for tokens
    const { tokens } = await client.getToken(code);

    // Get user info from Google using the access token
    client.setCredentials(tokens);
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });

    const googleUser = userInfo.data as GoogleUserInfo;

    // Find or create user in your database
    const { user, token } = await authService.findOrCreateGoogleUser({
      googleId: googleUser.sub as string, // Google ID is typically in 'sub' field
      email: googleUser.email as string,
      name: googleUser.name as string,
      // Potentially pass other fields like picture: googleUser.picture as string if needed
    });

    // Send the generated token and user data back to the frontend
    res.status(200).json({ success: true, user, token });

  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyOtp(email, otp);
    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (err: any) {
    // Handle specific error messages from the service
    if (err.message === 'User not found.' || err.message === 'OTP not requested for this email.' || err.message === 'Invalid OTP.' || err.message === 'OTP expired.' || err.message === 'Email already verified.') {
      res.status(400).json({ success: false, message: err.message });
    } else {
      console.error('OTP Verification Error:', err);
      next(err);
    }
  }
};

export const uploadProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const userId = (req as any).user.id;
    const result: CloudinaryUploadResult = await authService.uploadProfilePicture(userId, req.file);
    res.status(200).json({ success: true, profilePicture: result.secure_url });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Client-side handles token removal. Server just confirms success.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { name, email, phone, bio } = req.body;

    const updatedUser = await authService.updateProfile(userId, {
      name,
      email,
      phone,
      bio
    });

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
}; 