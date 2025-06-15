"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    console.log('AuthenticateJWT: Incoming Authorization header:', authHeader);
    if (!token) {
        console.log('AuthenticateJWT: No token provided.');
        return res.status(401).json({ success: false, error: 'No token, authorization denied' });
    }
    try {
        const secret = process.env.JWT_SECRET || 'my_super_secret_key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        console.log('AuthenticateJWT: Token verified successfully. Decoded:', decoded);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    }
    catch (err) {
        console.error('AuthenticateJWT: Token verification failed:', err);
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
};
exports.authenticateJWT = authenticateJWT;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: 'Forbidden: You do not have sufficient permissions' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
