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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: function () { return !this.googleId; },
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    role: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user',
    },
    profilePicture: String,
    bio: String,
    phone: String,
    yogaLevel: String,
    stripeCustomerId: String,
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    enrolledClasses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Class',
        }],
    teachingClasses: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Class',
        }],
    subscription: {
        plan: {
            type: String,
            enum: ['basic', 'premium', 'elite'],
            default: 'basic',
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'cancelled'],
            default: 'inactive',
        },
        startDate: Date,
        endDate: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: String,
    otpExpire: Date,
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    // Check if password is being modified and is not already hashed
    if (this.isModified('password') && this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
        try {
            const salt = await bcryptjs_1.default.genSalt(10);
            this.password = await bcryptjs_1.default.hash(this.password, salt);
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        next();
    }
});
// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return Promise.resolve(false);
    try {
        return await bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw error;
    }
};
// Add indexes for better query performance
// userSchema.index({ email: 1 }); // Removed as unique: true is already set above
userSchema.index({ role: 1 });
userSchema.index({ stripeCustomerId: 1 });
// userSchema.index({ googleId: 1 }, { unique: true, sparse: true }); // Removed as unique: true, sparse: true is already set above
exports.User = mongoose_1.default.model('User', userSchema);
