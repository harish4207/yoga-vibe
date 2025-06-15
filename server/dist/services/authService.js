"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getAllUsers = exports.uploadProfilePicture = exports.verifyOtp = exports.findOrCreateGoogleUser = exports.resetPassword = exports.requestPasswordReset = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const stream_1 = require("stream");
const register = async (data) => {
    const { name, email, password } = data;
    const existing = await User_1.User.findOne({ email });
    if (existing)
        throw new Error('Email already in use');
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpExpire = new Date(Date.now() + 1000 * 60 * 10); // OTP valid for 10 minutes
    const user = await User_1.User.create({
        name,
        email,
        password,
        role: 'user',
        otp,
        otpExpire,
        isVerified: false, // Mark user as unverified initially
    });
    // Send OTP email
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.config.smtp.host,
        port: config_1.config.smtp.port,
        auth: {
            user: config_1.config.smtp.user,
            pass: config_1.config.smtp.pass,
        },
    });
    const mailOptions = {
        from: config_1.config.smtp.user,
        to: user.email,
        subject: 'YogaVibe Email Verification OTP',
        html: `<p>Your OTP for YogaVibe email verification is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
    };
    await transporter.sendMail(mailOptions);
    // Return user data (excluding password and OTP)
    user.set('password', undefined, { strict: false });
    user.set('otp', undefined, { strict: false });
    user.set('otpExpire', undefined, { strict: false });
    return user;
};
exports.register = register;
const login = async (data) => {
    const { email, password } = data;
    console.log('Attempting login for email:', email);
    const user = await User_1.User.findOne({ email }).select('_id name email role isVerified profilePicture +password');
    console.log('User found:', !!user);
    if (!user) {
        console.log('Login failed: User not found');
        throw new Error('Invalid credentials');
    }
    // Check if email is verified
    console.log('User is verified:', user.isVerified);
    if (!user.isVerified) {
        console.log('Login failed: Email not verified');
        throw new Error('Email not verified. Please verify your email using the OTP sent to your inbox.');
    }
    const isMatch = await user.comparePassword(password);
    console.log('Password matches:', isMatch);
    if (!isMatch) {
        console.log('Login failed: Password mismatch');
        throw new Error('Invalid credentials');
    }
    console.log('Login successful for user:', user.email);
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
    // Return user data without sensitive information
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified
    };
    return { user: userData, token };
};
exports.login = login;
const getProfile = async (userId) => {
    console.log('AuthService.getProfile: Attempting to retrieve profile for userId:', userId);
    const user = await User_1.User.findById(userId).populate('enrolledClasses');
    if (!user) {
        console.log('AuthService.getProfile: User not found for userId:', userId);
        throw new Error('User not found');
    }
    console.log('AuthService.getProfile: User found:', user.email);
    return user;
};
exports.getProfile = getProfile;
const requestPasswordReset = async (email) => {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new Error('User not found');
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await user.save();
    const resetUrl = `${config_1.config.frontendUrl}/reset-password?token=${resetToken}`;
    const transporter = nodemailer_1.default.createTransport({
        host: config_1.config.smtp.host,
        port: config_1.config.smtp.port,
        auth: {
            user: config_1.config.smtp.user,
            pass: config_1.config.smtp.pass,
        },
    });
    await transporter.sendMail({
        from: config_1.config.smtp.user,
        to: user.email,
        subject: 'YogaVibe Password Reset',
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`
    });
    return true;
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword) => {
    const user = await User_1.User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: new Date() },
    });
    if (!user)
        throw new Error('Invalid or expired token');
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return true;
};
exports.resetPassword = resetPassword;
const findOrCreateGoogleUser = async (googleUserData) => {
    const { googleId, email, name } = googleUserData;
    // Try to find user by googleId first
    let user = await User_1.User.findOne({ googleId });
    if (!user) {
        // If not found by googleId, try to find by email
        user = await User_1.User.findOne({ email });
        if (user) {
            // If found by email but no googleId, link the account
            if (!user.googleId) {
                user.googleId = googleId;
                user.isVerified = true; // Assume Google email is verified
                await user.save();
            }
        }
        else {
            // If no user found by either googleId or email, create a new one
            user = await User_1.User.create({
                googleId,
                email,
                name,
                role: 'user',
                isVerified: true, // Google users are considered verified
            });
        }
    }
    // Generate JWT for the user
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
    // Return user and token (excluding sensitive fields like password if it existed)
    user.set('password', undefined, { strict: false }); // Ensure password is not returned
    user.set('otp', undefined, { strict: false });
    user.set('otpExpire', undefined, { strict: false });
    return { user, token };
};
exports.findOrCreateGoogleUser = findOrCreateGoogleUser;
const verifyOtp = async (email, otp) => {
    const user = await User_1.User.findOne({ email });
    if (!user) {
        throw new Error('User not found.');
    }
    if (user.isVerified) {
        throw new Error('Email already verified.');
    }
    if (!user.otp || !user.otpExpire) {
        throw new Error('OTP not requested for this email.');
    }
    if (user.otp !== otp) {
        throw new Error('Invalid OTP.');
    }
    if (user.otpExpire < new Date()) {
        // Clear expired OTP fields
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        throw new Error('OTP expired.');
    }
    // OTP is valid, verify the user and clear OTP fields
    console.log('Attempting to verify user and save...');
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    console.log('User verification status after save:', user.isVerified);
    return true; // Indicate successful verification
};
exports.verifyOtp = verifyOtp;
const uploadProfilePicture = async (userId, file) => {
    const user = await User_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    // Convert buffer to stream
    const stream = stream_1.Readable.from(file.buffer);
    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: 'profile_pictures',
            transformation: [
                { width: 500, height: 500, crop: 'fill' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        }, async (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                try {
                    // Update user's profile picture URL
                    user.profilePicture = result.secure_url;
                    await user.save();
                    resolve(result);
                }
                catch (saveError) {
                    reject(saveError);
                }
            }
            else {
                reject(new Error('Cloudinary upload failed: No result received.'));
            }
        });
        stream.pipe(uploadStream);
    });
};
exports.uploadProfilePicture = uploadProfilePicture;
const getAllUsers = async () => {
    const users = await User_1.User.find({}).select('-password -otp -otpExpire');
    return users;
};
exports.getAllUsers = getAllUsers;
const updateProfile = async (userId, updateData) => {
    const user = await User_1.User.findById(userId);
    if (!user)
        throw new Error('User not found');
    // Update only the fields that are provided
    if (updateData.name)
        user.name = updateData.name;
    if (updateData.email)
        user.email = updateData.email;
    if (updateData.phone)
        user.phone = updateData.phone;
    if (updateData.bio)
        user.bio = updateData.bio;
    await user.save();
    return user;
};
exports.updateProfile = updateProfile;
