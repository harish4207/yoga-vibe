import { Request, Response } from 'express';
import mongoose, { Document } from 'mongoose';
import * as classService from '../services/classService';
import { IYogaClass, YogaClass } from '../models/YogaClass';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

// Get all classes with optional filters
export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const {
      category,
      level,
      instructor,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (level) query.level = level;
    if (instructor) query.instructor = instructor;
    if (status) query.status = status;
    if (startDate || endDate) {
      query['schedule.startTime'] = {};
      if (startDate) query['schedule.startTime'].$gte = new Date(startDate as string);
      if (endDate) query['schedule.startTime'].$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [classes, total] = await Promise.all([
      YogaClass.find(query)
        .populate('instructor', 'name email')
        .sort({ 'schedule.startTime': 1 })
        .skip(skip)
        .limit(Number(limit)),
      YogaClass.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: classes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching classes',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get a single class by ID
export const getClassById = async (req: Request, res: Response) => {
  try {
    const classData: (Document<unknown, {}, IYogaClass> & IYogaClass) | null = await YogaClass.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching class',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create a new class
export const createClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    // Validate required fields
    const { title, description, style, level, duration, price, capacity, type, date } = req.body;
    
    if (!title || !description || !style || !level || !duration || !price || !capacity || !type || !date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid required fields',
      });
    }

    const classData: Document<unknown, {}, IYogaClass> & IYogaClass = new YogaClass({
      ...req.body,
      instructor: new mongoose.Types.ObjectId(req.user.id),
      enrolledStudents: [],
      status: 'scheduled',
      booked: 0,
      // Ensure type and date are correctly passed from req.body
      type: type,
      style: style,
      date: new Date(date), // Ensure date is a Date object
    });

    await classData.save();

    // Create a payment product for the class
    // try {
    //   const classObjectId = classData._id as mongoose.Types.ObjectId;
    //   await classService.createPaymentProduct(classObjectId.toHexString(), {
    //     name: title,
    //     description,
    //     price: price, // Use original price, conversion to paise done in service
    //     metadata: {
    //       classId: classObjectId.toHexString(),
    //       style: style,
    //       level,
    //       duration,
    //       capacity,
    //     }
    //   });
    // } catch (paymentError) {
    //   // If payment product creation fails, delete the class
    //   await classData.deleteOne();
    //   throw new Error('Failed to create payment product for class');
    // }

    res.status(201).json({
      success: true,
      data: classData,
    });
  } catch (error: any) {
    console.error('Error creating class:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.name === 'ValidationError') {
        // Mongoose validation error
        const validationError = error as mongoose.Error.ValidationError;
        const errors: { [key: string]: string } = {};
        for (let field in validationError.errors) {
          errors[field] = validationError.errors[field].message;
        }
        errorMessage = JSON.stringify(errors);
      }
    }
    res.status(400).json({
      success: false,
      error: 'Error creating class',
      message: errorMessage,
    });
  }
};

// Update a class
export const updateClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const classData: (Document<unknown, {}, IYogaClass> & IYogaClass) | null = await YogaClass.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    // Check if user is the instructor or admin
    if (
      classData.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this class',
      });
    }

    const updatedClass = await YogaClass.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Error updating class',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete a class
export const deleteClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const classData: (Document<unknown, {}, IYogaClass> & IYogaClass) | null = await YogaClass.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    // Check if user is the instructor or admin
    if (
      classData.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this class',
      });
    }

    await classData.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting class',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Enroll in a class
export const enrollInClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const classData: (Document<unknown, {}, IYogaClass> & IYogaClass) | null = await YogaClass.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    // Check if class is full
    if (classData.enrolledStudents.length >= classData.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Class is full',
      });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Check if user is already enrolled
    if (classData.enrolledStudents.some(id => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this class',
      });
    }

    classData.enrolledStudents.push(userId);
    await classData.save();

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error enrolling in class',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Unenroll from a class
export const unenrollFromClass = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
    }

    const classData: (Document<unknown, {}, IYogaClass> & IYogaClass) | null = await YogaClass.findById(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        error: 'Class not found',
      });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Check if user is enrolled
    if (!classData.enrolledStudents.some(id => id.equals(userId))) {
      return res.status(400).json({
        success: false,
        error: 'Not enrolled in this class',
      });
    }

    classData.enrolledStudents = classData.enrolledStudents.filter(
      id => !id.equals(userId)
    );
    await classData.save();

    res.json({
      success: true,
      data: classData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error unenrolling from class',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 