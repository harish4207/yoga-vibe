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
exports.Booking = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user'],
    },
    yogaClass: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'YogaClass',
        required: [true, 'Please provide a yoga class'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending',
    },
    paymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true, 'Please provide the booking amount'],
        min: [0, 'Amount cannot be negative'],
    },
}, {
    timestamps: true,
});
// Index for efficient querying
bookingSchema.index({ user: 1, yogaClass: 1 }, { unique: true });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ createdAt: 1 });
// Middleware to update class booked count
bookingSchema.pre('save', async function (next) {
    if (this.isNew) {
        const YogaClass = mongoose_1.default.model('YogaClass');
        await YogaClass.findByIdAndUpdate(this.yogaClass, {
            $inc: { booked: 1 },
        });
    }
    next();
});
// Middleware to update class booked count on deletion
bookingSchema.pre('deleteOne', { document: true }, async function (next) {
    const YogaClass = mongoose_1.default.model('YogaClass');
    await YogaClass.findByIdAndUpdate(this.yogaClass, {
        $inc: { booked: -1 },
    });
    next();
});
exports.Booking = mongoose_1.default.model('Booking', bookingSchema);
