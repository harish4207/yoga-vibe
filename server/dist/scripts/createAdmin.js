"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAdmin = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUri);
        console.log('Connected to MongoDB');
        // Check if admin already exists
        const existingAdmin = await User_1.User.findOne({ email: 'admin@yogastudio.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        // Create admin user
        const hashedPassword = await bcryptjs_1.default.hash('Admin@123', 10);
        const admin = await User_1.User.create({
            name: 'Admin User',
            email: 'admin@yogastudio.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
        });
        console.log('Admin user created successfully:', admin.email);
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};
createAdmin();
