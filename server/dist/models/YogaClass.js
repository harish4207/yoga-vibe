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
exports.YogaClass = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const yogaClassSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide an instructor'],
    },
    type: {
        type: String,
        enum: ['live', 'recorded'],
        required: [true, 'Please specify the class type'],
    },
    style: {
        type: String,
        enum: ['hatha', 'vinyasa', 'ashtanga', 'yin', 'restorative', 'power'],
        required: [true, 'Please specify the yoga style'],
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: [true, 'Please specify the difficulty level'],
    },
    duration: {
        type: Number,
        required: [true, 'Please specify the duration in minutes'],
        min: [15, 'Duration must be at least 15 minutes'],
        max: [180, 'Duration cannot exceed 180 minutes'],
    },
    capacity: {
        type: Number,
        required: [true, 'Please specify the class capacity'],
        min: [1, 'Capacity must be at least 1'],
    },
    booked: {
        type: Number,
        default: 0,
        min: [0, 'Booked count cannot be negative'],
    },
    price: {
        type: Number,
        required: [true, 'Please specify the price'],
        min: [0, 'Price cannot be negative'],
    },
    date: {
        type: Date,
        required: [true, 'Please specify the class date and time'],
    },
    videoUrl: {
        type: String,
        default: '',
    },
    thumbnailUrl: {
        type: String,
        default: '',
    },
    ratings: [
        {
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            review: {
                type: String,
                trim: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, {
    timestamps: true,
});
// Index for efficient querying
yogaClassSchema.index({ date: 1, type: 1 });
yogaClassSchema.index({ style: 1, level: 1 });
yogaClassSchema.index({ instructor: 1 });
exports.YogaClass = mongoose_1.default.model('YogaClass', yogaClassSchema);
