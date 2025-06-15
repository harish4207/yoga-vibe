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
exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const subscriptionService = __importStar(require("../services/subscriptionService"));
const createPlan = async (req, res) => {
    try {
        const planData = req.body;
        const newPlan = await subscriptionService.createPlan(planData);
        res.status(201).json({ success: true, data: newPlan });
    }
    catch (error) {
        console.error('Error creating subscription plan:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createPlan = createPlan;
const getAllPlans = async (req, res) => {
    try {
        const plans = await subscriptionService.getAllPlans();
        res.status(200).json({ success: true, data: plans });
    }
    catch (error) {
        console.error('Error fetching subscription plans:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAllPlans = getAllPlans;
const getPlanById = async (req, res) => {
    try {
        const planId = req.params.id;
        const plan = await subscriptionService.getPlanById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, error: 'Subscription plan not found' });
        }
        res.status(200).json({ success: true, data: plan });
    }
    catch (error) {
        console.error('Error fetching subscription plan by ID:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getPlanById = getPlanById;
const updatePlan = async (req, res) => {
    try {
        const planId = req.params.planId;
        console.log("Received planId for update:", planId);
        const planData = req.body;
        const updatedPlan = await subscriptionService.updatePlan(planId, planData);
        if (!updatedPlan) {
            return res.status(404).json({ success: false, error: 'Subscription plan not found' });
        }
        res.status(200).json({ success: true, data: updatedPlan });
    }
    catch (error) {
        console.error('Error updating subscription plan:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updatePlan = updatePlan;
const deletePlan = async (req, res) => {
    try {
        const planId = req.params.id;
        const deletedPlan = await subscriptionService.deletePlan(planId);
        if (!deletedPlan) {
            return res.status(404).json({ success: false, error: 'Subscription plan not found' });
        }
        res.status(200).json({ success: true, data: deletedPlan });
    }
    catch (error) {
        console.error('Error deleting subscription plan:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deletePlan = deletePlan;
