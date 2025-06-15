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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.logout = exports.getAllUsers = exports.uploadProfilePicture = exports.verifyOtp = exports.googleAuthCallback = exports.resetPassword = exports.requestPasswordReset = exports.getProfile = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
const google_auth_library_1 = require("google-auth-library");
const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
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
    }
    catch (err) {
        console.error('Login error:', err);
        if (err.message === 'Invalid credentials') {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        else if (err.message.includes('Email not verified')) {
            res.status(403).json({
                success: false,
                message: err.message
            });
        }
        else {
            console.error('Unexpected login error:', err);
            res.status(500).json({
                success: false,
                message: 'An unexpected error occurred during login'
            });
        }
    }
};
exports.login = login;
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        console.log('AuthController.getProfile: User ID from token:', userId);
        const user = await authService.getProfile(userId);
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        console.error('AuthConroller.getProfile: Error fetching profile:', err);
        next(err);
    }
};
exports.getProfile = getProfile;
const requestPasswordReset = async (req, res, next) => {
    try {
        await authService.requestPasswordReset(req.body.email);
        res.status(200).json({ success: true, message: 'Password reset email sent' });
    }
    catch (err) {
        next(err);
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.body.token, req.body.password);
        res.status(200).json({ success: true, message: 'Password reset successful' });
    }
    catch (err) {
        next(err);
    }
};
exports.resetPassword = resetPassword;
const googleAuthCallback = async (req, res, next) => {
    try {
        const { code } = req.body;
        // Temporary logging to check environment variables
        console.log('Backend GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
        console.log('Backend GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
        console.log('Backend GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
        // End of temporary logging
        // Initialize Google OAuth2 client
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
            throw new Error('Google OAuth configuration is missing.');
        }
        const client = new google_auth_library_1.OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);
        // Exchange authorization code for tokens
        const { tokens } = await client.getToken(code);
        // Get user info from Google using the access token
        client.setCredentials(tokens);
        const userInfo = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        });
        const googleUser = userInfo.data;
        // Find or create user in your database
        const { user, token } = await authService.findOrCreateGoogleUser({
            googleId: googleUser.sub, // Google ID is typically in 'sub' field
            email: googleUser.email,
            name: googleUser.name,
            // Potentially pass other fields like picture: googleUser.picture as string if needed
        });
        // Send the generated token and user data back to the frontend
        res.status(200).json({ success: true, user, token });
    }
    catch (err) {
        console.error('Google Auth Error:', err);
        res.status(500).json({ success: false, message: 'Google authentication failed.' });
    }
};
exports.googleAuthCallback = googleAuthCallback;
const verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        await authService.verifyOtp(email, otp);
        res.status(200).json({ success: true, message: 'Email verified successfully.' });
    }
    catch (err) {
        // Handle specific error messages from the service
        if (err.message === 'User not found.' || err.message === 'OTP not requested for this email.' || err.message === 'Invalid OTP.' || err.message === 'OTP expired.' || err.message === 'Email already verified.') {
            res.status(400).json({ success: false, message: err.message });
        }
        else {
            console.error('OTP Verification Error:', err);
            next(err);
        }
    }
};
exports.verifyOtp = verifyOtp;
const uploadProfilePicture = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        const userId = req.user.id;
        const result = await authService.uploadProfilePicture(userId, req.file);
        res.status(200).json({ success: true, profilePicture: result.secure_url });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
const getAllUsers = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }
    catch (err) {
        next(err);
    }
};
exports.getAllUsers = getAllUsers;
const logout = async (req, res, next) => {
    try {
        // Client-side handles token removal. Server just confirms success.
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (err) {
        console.error('Logout error:', err);
        next(err);
    }
};
exports.logout = logout;
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
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
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
