"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth"); // Assuming auth middleware is in this path
const isAdmin_1 = require("../middleware/isAdmin"); // Assuming isAdmin middleware is in this path
const contentInteractionController_1 = require("../controllers/contentInteractionController");
const router = express_1.default.Router();
// User Interaction Routes (Private - User)
router.put('/bookmark/:contentId', auth_1.auth, contentInteractionController_1.toggleBookmark);
router.put('/rate/:contentId', auth_1.auth, contentInteractionController_1.rateContent);
router.put('/feedback/:contentId', auth_1.auth, contentInteractionController_1.submitFeedback);
router.put('/complete/:contentId', auth_1.auth, contentInteractionController_1.markCompleted);
// Admin Analytics Routes (Private - Admin)
router.get('/analytics/popular-content', auth_1.auth, isAdmin_1.isAdmin, contentInteractionController_1.getPopularContent);
router.get('/analytics/total-completed-sessions', auth_1.auth, isAdmin_1.isAdmin, contentInteractionController_1.getTotalCompletedSessions);
exports.default = router;
