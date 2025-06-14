import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './config';
import passport from './config/passport';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import authRoutes from './routes/authRoutes';
import classRoutes from './routes/classRoutes';
import paymentRoutes from './routes/paymentRoutes';
import contentRoutes from './routes/contentRoutes';
import goalRoutes from './routes/goalRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import interactionRoutes from './routes/interactionRoutes';
import communityRoutes from './routes/communityRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [config.frontendUrl, 'https://yogavibe.vercel.app'] // Add your production frontend URL
    : true, // Allow all origins in development
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));

// Trust proxy for express-rate-limit
app.set('trust proxy', 1);

// Session middleware (required for Passport)
app.use(
  session({
    secret: config.jwt.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Google OAuth routes
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Issue JWT and send to frontend
    const user = req.user as any;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as any
    );
    // You can redirect with token or send as JSON
    res.redirect(`${config.frontendUrl}/auth/callback?token=${token}`);
    // Or: res.json({ token });
  }
);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to YogaVibe API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api', chatRoutes);
app.use('/api/messages', messageRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : undefined,
  });
});

// Connect to MongoDB
mongoose
  .connect(config.mongoUri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
    minPoolSize: 5,
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

console.log('MONGODB_URI:', process.env.MONGODB_URI); 