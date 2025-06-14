/*
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
// Make sure to install dotenv: npm install dotenv
require('dotenv').config({ path: './.env' }); // Load environment variables from .env file in the server directory

// Import the User model
const User = require('../models/User'); // Adjust the path based on your project structure

// Ensure these environment variables are set in your backend's .env file
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI; // This should match the redirect URI configured in Google Cloud Console and used in the frontend
const JWT_SECRET = process.env.JWT_SECRET; // Your secret key for signing JWTs

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST endpoint to handle Google OAuth callback
router.post('/google', async (req, res) => {
  const { code } = req.body; // Get the authorization code from the frontend

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing.' });
  }

  try {
    // 1. Exchange the authorization code for tokens with Google
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code', // Standard OAuth 2.0 grant type
    });

    const { id_token, access_token } = tokenResponse.data; // id_token contains user info, access_token for Google APIs (if needed)

    // 2. Verify and decode the ID token to get user information
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload(); // Contains the user's profile information
    const { sub, email, name, picture, email_verified } = payload; // Extract relevant fields

    // Crucial check: Ensure the email is verified by Google
    if (!email_verified) {
      return res.status(400).json({ message: 'Google email not verified. Cannot proceed.' });
    }

    // 3. Find or Create User in your database using Mongoose
    let user = await User.findOne({ googleId: sub }); // Try finding user by Google ID

    if (!user) {
      // If user not found by googleId, try finding by email
      user = await User.findOne({ email });

      if (user) {
        // If user found by email but not by googleId, link the Google ID to the existing account
        user.googleId = sub;
        // Optionally update name and profile picture from Google
        user.name = user.name || name; // Keep existing name if available
        user.profilePicture = user.profilePicture || picture; // Keep existing picture if available
        await user.save();
      } else {
        // If no user found by either googleId or email, create a new user
        user = new User({
          googleId: sub,
          name: name,
          email: email,
          profilePicture: picture, // Store profile picture URL if available
          role: 'user', // Default role for new users
          // Add other default fields as needed
        });
        await user.save();
      }
    }
    // If user was found by googleId, the 'user' variable already holds the correct document

    // 4. Generate your application's JWT for the authenticated user
    const appToken = jwt.sign(
        { userId: user._id, email: user.email, role: user.role }, // Include role in payload
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // 5. Send the user information and your application's JWT back to the frontend
    res.status(200).json({
      user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.profilePicture, // Send profile picture as avatar
          role: user.role,
          // Include other fields the frontend needs
      },
      token: appToken,
    });

  } catch (error) {
    console.error('Google Authentication Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Authentication failed. Please try again.' });
  }
});

module.exports = router; // Export the router
*/
