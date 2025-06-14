import { YogaClass } from '../models/YogaClass';
import { User } from '../models/User';
import razorpay from '../config/razorpay';

export const createClass = async (data: any, userId: string) => {
  const instructor = await User.findById(userId);
  if (!instructor || (instructor.role !== 'admin' && instructor.role !== 'instructor')) {
    throw new Error('Unauthorized');
  }
  const yogaClass = await YogaClass.create({ ...data, instructor: userId });
  return yogaClass;
};

export const createPaymentProduct = async (classId: string, productData: {
  name: string;
  description: string;
  price: number;
  metadata: Record<string, any>;
}) => {
  try {
    // Create a plan in Razorpay
    const plan = await razorpay.plans.create({
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
    await YogaClass.findByIdAndUpdate(classId, {
      paymentPlanId: plan.id,
      paymentAmount: productData.price * 100 // Store amount in paise
    });

    return { planId: plan.id };
  } catch (error: any) {
    console.error('Error creating payment plan:', error.response?.data || error.message || error);
    throw new Error('Failed to create payment plan');
  }
};

export const createOrder = async (classId: string, userId: string) => {
  try {
    const yogaClass = await YogaClass.findById(classId);
    if (!yogaClass) {
      throw new Error('Class not found');
    }

    const order = await razorpay.orders.create({
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
  } catch (error: any) {
    console.error('Error creating order:', error.response?.data || error.message || error);
    throw new Error('Failed to create order');
  }
};

export const getAllClasses = async (query: any) => {
  // Add filtering by style, level, instructor, etc. as needed
  const filter: any = {};
  if (query.style) filter.style = query.style;
  if (query.level) filter.level = query.level;
  if (query.instructor) filter.instructor = query.instructor;
  return YogaClass.find(filter).populate('instructor', 'name profilePicture');
};

export const getClassById = async (id: string) => {
  const yogaClass = await YogaClass.findById(id).populate('instructor', 'name profilePicture');
  if (!yogaClass) throw new Error('Class not found');
  return yogaClass;
};

export const updateClass = async (id: string, data: any, userId: string) => {
  const yogaClass = await YogaClass.findById(id);
  if (!yogaClass) throw new Error('Class not found');
  if (yogaClass.instructor.toString() !== userId) throw new Error('Unauthorized');
  Object.assign(yogaClass, data);
  await yogaClass.save();
  return yogaClass;
};

export const deleteClass = async (id: string, userId: string) => {
  const yogaClass = await YogaClass.findById(id);
  if (!yogaClass) throw new Error('Class not found');
  if (yogaClass.instructor.toString() !== userId) throw new Error('Unauthorized');
  await yogaClass.deleteOne();
  return true;
}; 