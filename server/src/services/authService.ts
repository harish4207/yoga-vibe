import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  // Add other properties you might need from the result
}

export const register = async (data: any) => {
  const { name, email, password } = data;
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const otpExpire = new Date(Date.now() + 1000 * 60 * 10); // OTP valid for 10 minutes

  const user = await User.create({
    name,
    email,
    password,
    role: 'user',
    otp,
    otpExpire,
    isVerified: false, // Mark user as unverified initially
  });

  // Send OTP email
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const mailOptions = {
    from: config.smtp.user,
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

export const login = async (data: any) => {
  const { email, password } = data;
  console.log('Attempting login for email:', email);

  const user = await User.findOne({ email }).select('_id name email role isVerified profilePicture +password');
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
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as any
  );
  
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

export const getProfile = async (userId: string) => {
  console.log('AuthService.getProfile: Attempting to retrieve profile for userId:', userId);
  const user = await User.findById(userId).populate('enrolledClasses');
  if (!user) {
    console.log('AuthService.getProfile: User not found for userId:', userId);
    throw new Error('User not found');
  }
  console.log('AuthService.getProfile: User found:', user.email);
  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();

  const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
  await transporter.sendMail({
    from: config.smtp.user,
    to: user.email,
    subject: 'YogaVibe Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`
  });
  return true;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: new Date() },
  });
  if (!user) throw new Error('Invalid or expired token');
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  return true;
};

export const findOrCreateGoogleUser = async (googleUserData: { googleId: string; email: string; name: string }) => {
  const { googleId, email, name } = googleUserData;

  // Try to find user by googleId first
  let user = await User.findOne({ googleId });

  if (!user) {
    // If not found by googleId, try to find by email
    user = await User.findOne({ email });

    if (user) {
      // If found by email but no googleId, link the account
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Assume Google email is verified
        await user.save();
      }
    } else {
      // If no user found by either googleId or email, create a new one
      user = await User.create({
        googleId,
        email,
        name,
        role: 'user',
        isVerified: true, // Google users are considered verified
      });
    }
  }

  // Generate JWT for the user
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as any
  );

  // Return user and token (excluding sensitive fields like password if it existed)
  user.set('password', undefined, { strict: false }); // Ensure password is not returned
  user.set('otp', undefined, { strict: false });
  user.set('otpExpire', undefined, { strict: false });

  return { user, token };
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

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

export const uploadProfilePicture = async (userId: string, file: Express.Multer.File): Promise<CloudinaryUploadResult> => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Convert buffer to stream
  const stream = Readable.from(file.buffer);

  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_pictures',
        transformation: [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      async (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          try {
            // Update user's profile picture URL
            user.profilePicture = result.secure_url;
            await user.save();
            resolve(result as CloudinaryUploadResult);
          } catch (saveError) {
            reject(saveError);
          }
        } else {
          reject(new Error('Cloudinary upload failed: No result received.'));
        }
      }
    );

    stream.pipe(uploadStream);
  });
};

export const getAllUsers = async () => {
  const users = await User.find({}).select('-password -otp -otpExpire');
  return users;
};

export const updateProfile = async (userId: string, updateData: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Update only the fields that are provided
  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.bio) user.bio = updateData.bio;

  await user.save();
  return user;
}; 