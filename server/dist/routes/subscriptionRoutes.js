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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const isAdmin_1 = require("../middleware/isAdmin");
const subscriptionController = __importStar(require("../controllers/subscriptionController"));
const router = express_1.default.Router();
// Get all active subscription plans (public)
router.get('/plans', subscriptionController.getAllPlans);
// Get user's current subscription (user)
router.get('/my-subscription', auth_1.auth, /* TODO: Implement user subscription retrieval route */ (req, res) => {
    res.json({ success: true, message: 'Subscription endpoint not implemented yet' });
});
// Create new subscription plan (admin)
router.post('/plans', auth_1.auth, isAdmin_1.isAdmin, subscriptionController.createPlan);
// Update subscription plan (admin)
router.put('/plans/:planId', auth_1.auth, isAdmin_1.isAdmin, subscriptionController.updatePlan);
// Delete subscription plan (admin)
router.delete('/plans/:planId', auth_1.auth, isAdmin_1.isAdmin, subscriptionController.deletePlan);
exports.default = router;
