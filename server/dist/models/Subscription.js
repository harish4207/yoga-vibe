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
exports.Subscription = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const subscriptionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user'],
    },
    plan: {
        type: String,
        enum: ['basic', 'premium', 'elite'],
        required: [true, 'Please specify the subscription plan'],
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Please specify the start date'],
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: [true, 'Please specify the end date'],
    },
    autoRenew: {
        type: Boolean,
        default: true,
    },
    paymentId: {
        type: String,
    },
}, {
    timestamps: true,
});
// Index for efficient querying
// Removed: subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });
// Middleware to check subscription expiration
subscriptionSchema.pre('save', async function (next) {
    if (this.isModified('endDate') || this.isNew) {
        if (this.endDate < new Date()) {
            this.status = 'expired';
        }
    }
    next();
});
// Static method to get subscription benefits
subscriptionSchema.statics.getPlanBenefits = function (plan) {
    const benefits = {
        basic: {
            maxClassesPerMonth: 4,
            videoAccess: false,
            liveClasses: true,
            personalInstructor: false,
            price: 29.99,
        },
        premium: {
            maxClassesPerMonth: 12,
            videoAccess: true,
            liveClasses: true,
            personalInstructor: false,
            price: 49.99,
        },
        elite: {
            maxClassesPerMonth: -1, // unlimited
            videoAccess: true,
            liveClasses: true,
            personalInstructor: true,
            price: 99.99,
        },
    };
    return benefits[plan];
};
exports.Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
