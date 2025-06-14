import { Request, Response } from 'express';
import * as subscriptionService from '../services/subscriptionService';

export const createPlan = async (req: Request, res: Response) => {
  try {
    const planData = req.body;
    const newPlan = await subscriptionService.createPlan(planData);
    res.status(201).json({ success: true, data: newPlan });
  } catch (error: any) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await subscriptionService.getAllPlans();
    res.status(200).json({ success: true, data: plans });
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPlanById = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id;
    const plan = await subscriptionService.getPlanById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Subscription plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error: any) {
    console.error('Error fetching subscription plan by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response) => {
  try {
    const planId = req.params.planId;
    console.log("Received planId for update:", planId);
    const planData = req.body;
    const updatedPlan = await subscriptionService.updatePlan(planId, planData);
    if (!updatedPlan) {
      return res.status(404).json({ success: false, error: 'Subscription plan not found' });
    }
    res.status(200).json({ success: true, data: updatedPlan });
  } catch (error: any) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePlan = async (req: Request, res: Response) => {
  try {
    const planId = req.params.id;
    const deletedPlan = await subscriptionService.deletePlan(planId);
    if (!deletedPlan) {
      return res.status(404).json({ success: false, error: 'Subscription plan not found' });
    }
    res.status(200).json({ success: true, data: deletedPlan });
  } catch (error: any) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}; 