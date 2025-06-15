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
const mongoose_1 = __importStar(require("mongoose"));
const classSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Class title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Class description is required'],
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Instructor is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Hatha',
            'Vinyasa',
            'Ashtanga',
            'Yin',
            'Power',
            'Restorative',
            'Meditation',
            'Kundalini',
            'Iyengar',
            'Bikram',
            'Prenatal',
            'Kids',
            'Other'
        ],
    },
    level: {
        type: String,
        required: [true, 'Level is required'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [15, 'Duration must be at least 15 minutes'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
    },
    maxStudents: {
        type: Number,
        required: [true, 'Maximum number of students is required'],
        min: [1, 'Maximum students must be at least 1'],
    },
    schedule: {
        startTime: {
            type: Date,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: Date,
            required: [true, 'End time is required'],
        },
        recurring: {
            type: Boolean,
            default: false,
        },
        daysOfWeek: {
            type: [Number],
            validate: {
                validator: function (v) {
                    return v.every(day => day >= 0 && day <= 6);
                },
                message: 'Days must be between 0 and 6',
            },
        },
    },
    location: {
        type: {
            type: String,
            required: [true, 'Location type is required'],
            enum: ['online', 'in-person'],
        },
        address: String,
        meetingLink: String,
    },
    enrolledStudents: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
    status: {
        type: String,
        required: true,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    imageUrl: {
        type: String,
    },
}, {
    timestamps: true,
});
// Add indexes for better query performance
classSchema.index({ instructor: 1 });
classSchema.index({ category: 1 });
classSchema.index({ level: 1 });
classSchema.index({ 'schedule.startTime': 1 });
classSchema.index({ status: 1 });
exports.default = mongoose_1.default.model('Class', classSchema);
