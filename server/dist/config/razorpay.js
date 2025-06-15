"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not defined in environment variables');
}
console.log('Razorpay Key ID being used:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret being used:', process.env.RAZORPAY_KEY_SECRET ? '********' : 'Undefined'); // Mask secret for security
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.default = razorpay;
