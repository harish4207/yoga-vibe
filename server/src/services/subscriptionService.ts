import SubscriptionPlan, { ISubscriptionPlan } from '../models/SubscriptionPlan';

export const createPlan = async (planData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> => {
  const plan = new SubscriptionPlan(planData);
  await plan.save();
  return plan;
};

export const getAllPlans = async (): Promise<ISubscriptionPlan[]> => {
  const plans = await SubscriptionPlan.find({});
  return plans;
};

export const getPlanById = async (id: string): Promise<ISubscriptionPlan | null> => {
  const plan = await SubscriptionPlan.findById(id);
  return plan;
};

export const updatePlan = async (id: string, planData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan | null> => {
  const plan = await SubscriptionPlan.findByIdAndUpdate(id, planData, { new: true });
  return plan;
};

export const deletePlan = async (id: string): Promise<ISubscriptionPlan | null> => {
  const plan = await SubscriptionPlan.findByIdAndDelete(id);
  return plan;
}; 