"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.updateClass = exports.getClassById = exports.getAllClasses = exports.createOrder = exports.createPaymentProduct = exports.createClass = void 0;
const YogaClass_1 = require("../models/YogaClass");
const User_1 = require("../models/User");
const razorpay_1 = __importDefault(require("../config/razorpay"));
const createClass = async (data, userId) => {
    const instructor = await User_1.User.findById(userId);
    if (!instructor || (instructor.role !== 'admin' && instructor.role !== 'instructor')) {
        throw new Error('Unauthorized');
    }
    const yogaClass = await YogaClass_1.YogaClass.create({ ...data, instructor: userId });
    return yogaClass;
};
exports.createClass = createClass;
const createPaymentProduct = async (classId, productData) => {
    try {
        // Create a plan in Razorpay
        const plan = await razorpay_1.default.plans.create({
            period: 'monthly',
            interval: 1,
            item: {
                name: productData.name,
                description: productData.description,
                amount: productData.price * 100, // Convert to paise
                currency: 'INR'
            },
            notes: productData.metadata
        });
        // Update the class with payment plan info
        await YogaClass_1.YogaClass.findByIdAndUpdate(classId, {
            paymentPlanId: plan.id,
            paymentAmount: productData.price * 100 // Store amount in paise
        });
        return { planId: plan.id };
    }
    catch (error) {
        console.error('Error creating payment plan:', error.response?.data || error.message || error);
        throw new Error('Failed to create payment plan');
    }
};
exports.createPaymentProduct = createPaymentProduct;
const createOrder = async (classId, userId) => {
    try {
        const yogaClass = await YogaClass_1.YogaClass.findById(classId);
        if (!yogaClass) {
            throw new Error('Class not found');
        }
        const order = await razorpay_1.default.orders.create({
            amount: yogaClass.price * 100, // Use yogaClass.price and convert to paise
            currency: 'INR',
            receipt: `class_${classId.substring(0, 10)}_${Date.now().toString().slice(-8)}`,
            notes: {
                classId: classId,
                userId: userId
            }
        });
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        };
    }
    catch (error) {
        console.error('Error creating order:', error.response?.data || error.message || error);
        throw new Error('Failed to create order');
    }
};
exports.createOrder = createOrder;
const getAllClasses = async (query) => {
    // Add filtering by style, level, instructor, etc. as needed
    const filter = {};
    if (query.style)
        filter.style = query.style;
    if (query.level)
        filter.level = query.level;
    if (query.instructor)
        filter.instructor = query.instructor;
    return YogaClass_1.YogaClass.find(filter).populate('instructor', 'name profilePicture');
};
exports.getAllClasses = getAllClasses;
const getClassById = async (id) => {
    const yogaClass = await YogaClass_1.YogaClass.findById(id).populate('instructor', 'name profilePicture');
    if (!yogaClass)
        throw new Error('Class not found');
    return yogaClass;
};
exports.getClassById = getClassById;
const updateClass = async (id, data, userId) => {
    const yogaClass = await YogaClass_1.YogaClass.findById(id);
    if (!yogaClass)
        throw new Error('Class not found');
    if (yogaClass.instructor.toString() !== userId)
        throw new Error('Unauthorized');
    Object.assign(yogaClass, data);
    await yogaClass.save();
    return yogaClass;
};
exports.updateClass = updateClass;
const deleteClass = async (id, userId) => {
    const yogaClass = await YogaClass_1.YogaClass.findById(id);
    if (!yogaClass)
        throw new Error('Class not found');
    if (yogaClass.instructor.toString() !== userId)
        throw new Error('Unauthorized');
    await yogaClass.deleteOne();
    return true;
};
exports.deleteClass = deleteClass;
