"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = require("express-rate-limit");
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const passport_1 = __importDefault(require("./config/passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const classRoutes_1 = __importDefault(require("./routes/classRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const interactionRoutes_1 = __importDefault(require("./routes/interactionRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? [config_1.config.frontendUrl, 'https://yogavibe.vercel.app'] // Add your production frontend URL
        : true, // Allow all origins in development
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
// Trust proxy for express-rate-limit
app.set('trust proxy', 1);
// Session middleware (required for Passport)
app.use((0, express_session_1.default)({
    secret: config_1.config.jwt.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
}));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
// Google OAuth routes
app.get('/api/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/api/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    // Issue JWT and send to frontend
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, config_1.config.jwt.secret, { expiresIn: config_1.config.jwt.expiresIn });
    // You can redirect with token or send as JSON
    res.redirect(`${config_1.config.frontendUrl}/auth/callback?token=${token}`);
    // Or: res.json({ token });
});
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to YogaVibe API' });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/classes', classRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/content', contentRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.use('/api/interactions', interactionRoutes_1.default);
app.use('/api/community', communityRoutes_1.default);
app.use('/api', chatRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
// Serve static files from the React app's build directory
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/build')));
// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../client', 'build', 'index.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: config_1.config.env === 'development' ? err.message : undefined,
    });
});
// Connect to MongoDB
mongoose_1.default
    .connect(config_1.config.mongoUri, {
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
    app.listen(config_1.config.port, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Close server & exit process
    process.exit(1);
});
console.log('MONGODB_URI:', process.env.MONGODB_URI);
