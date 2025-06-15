"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth"); // Assuming auth middleware is in this path
const isAdmin_1 = require("../middleware/isAdmin"); // Assuming isAdmin middleware is in this path
const communityController_1 = require("../controllers/communityController");
const router = express_1.default.Router();
// User Community Routes (Private - User)
router.post('/posts', auth_1.auth, communityController_1.createPost); // Create a new post
router.get('/posts', communityController_1.getPosts); // Get all posts (public/private depending on role)
router.get('/posts/:postId', communityController_1.getPostById); // Get a single post
router.post('/posts/:postId/comments', auth_1.auth, communityController_1.addComment); // Add a comment
router.put('/posts/:postId/like', auth_1.auth, communityController_1.toggleLike); // Toggle like status
router.put('/posts/:postId/flag', auth_1.auth, communityController_1.flagPost); // Flag post for moderation
// Admin Community Routes (Private - Admin)
router.put('/posts/:postId/delete', auth_1.auth, communityController_1.softDeletePost); // Soft delete post (can be admin or author)
router.put('/posts/:postId/unflag', auth_1.auth, isAdmin_1.isAdmin, communityController_1.unflagPost); // Unflag post (admin only)
router.get('/posts/flagged', auth_1.auth, isAdmin_1.isAdmin, communityController_1.getFlaggedPosts); // Get all flagged posts (admin only)
exports.default = router;
