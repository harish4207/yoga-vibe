"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const SubscriptionPlan_1 = __importDefault(require("../models/SubscriptionPlan"));
const createPlan = async (planData) => {
    const plan = new SubscriptionPlan_1.default(planData);
    await plan.save();
    return plan;
};
exports.createPlan = createPlan;
const getAllPlans = async () => {
    const plans = await SubscriptionPlan_1.default.find({});
    return plans;
};
exports.getAllPlans = getAllPlans;
const getPlanById = async (id) => {
    const plan = await SubscriptionPlan_1.default.findById(id);
    return plan;
};
exports.getPlanById = getPlanById;
const updatePlan = async (id, planData) => {
    const plan = await SubscriptionPlan_1.default.findByIdAndUpdate(id, planData, { new: true });
    return plan;
};
exports.updatePlan = updatePlan;
const deletePlan = async (id) => {
    const plan = await SubscriptionPlan_1.default.findByIdAndDelete(id);
    return plan;
};
exports.deletePlan = deletePlan;
