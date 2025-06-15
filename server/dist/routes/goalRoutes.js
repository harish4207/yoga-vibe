"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const isAdmin_1 = require("../middleware/isAdmin");
// import UserGoal from '../models/UserGoal'; // We will use the controller instead
const goalController_1 = require("../controllers/goalController"); // Import controller functions
const router = express_1.default.Router();
// Get user's goals (user)
router.get('/my-goals', auth_1.auth, goalController_1.getUserGoals); // Use controller function
// Update user's goals (user)
router.put('/my-goals', auth_1.auth, goalController_1.updateUserGoals); // Use controller function
// Get all users' goals (admin)
router.get('/all-goals', auth_1.auth, isAdmin_1.isAdmin, async (req, res) => {
    // Keeping inline for now, or move to controller later if needed
    // TODO: Move admin goal routes to controller
    try {
        // Assuming UserGoal import is needed here if not moved to controller
        // import UserGoal from '../models/UserGoal';
        // const goals = await UserGoal.find().populate('userId', 'name email');
        res.json({ success: true, data: [] }); // Placeholder
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching all goals' });
    }
});
// Update specific user's goals (admin)
router.put('/user-goals/:userId', auth_1.auth, isAdmin_1.isAdmin, async (req, res) => {
    // Keeping inline for now, or move to controller later if needed
    // TODO: Move admin goal routes to controller
    try {
        // Assuming UserGoal import is needed here if not moved to controller
        // import UserGoal from '../models/UserGoal';
        // const goals = await UserGoal.findOneAndUpdate(
        //   { userId: req.params.userId },
        //   { $set: req.body },
        //   { new: true, upsert: true }
        // );
        res.json({ success: true, data: {} }); // Placeholder
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user goals' });
    }
});
exports.default = router;
