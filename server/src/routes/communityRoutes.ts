import express from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/authMiddleware';
import {
  createPost,
  getPosts,
  getPostById,
  addComment,
  toggleLike,
  softDeletePost,
  flagPost,
  unflagPost,
  getFlaggedPosts
} from '../controllers/communityController';

const router = express.Router();

// User Community Routes (Private - User)
router.post('/posts', authenticateJWT, createPost); // Create a new post
router.get('/posts', getPosts); // Get all posts (public/private depending on role)
router.get('/posts/:postId', getPostById); // Get a single post
router.post('/posts/:postId/comments', authenticateJWT, addComment); // Add a comment
router.put('/posts/:postId/like', authenticateJWT, toggleLike); // Toggle like status
router.put('/posts/:postId/flag', authenticateJWT, flagPost); // Flag post for moderation

// Admin Community Routes (Private - Admin)
router.put('/posts/:postId/delete', authenticateJWT, softDeletePost); // Soft delete post (can be admin or author)
router.put('/posts/:postId/unflag', authenticateJWT, authorizeRoles(['admin']), unflagPost); // Unflag post (admin only)
router.get('/posts/flagged', authenticateJWT, authorizeRoles(['admin']), getFlaggedPosts); // Get all flagged posts (admin only)

export default router; 