import express from 'express';
import { auth } from '../middleware/auth'; // Assuming auth middleware is in this path
import { isAdmin } from '../middleware/isAdmin'; // Assuming isAdmin middleware is in this path
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
router.post('/posts', auth, createPost); // Create a new post
router.get('/posts', getPosts); // Get all posts (public/private depending on role)
router.get('/posts/:postId', getPostById); // Get a single post
router.post('/posts/:postId/comments', auth, addComment); // Add a comment
router.put('/posts/:postId/like', auth, toggleLike); // Toggle like status
router.put('/posts/:postId/flag', auth, flagPost); // Flag post for moderation

// Admin Community Routes (Private - Admin)
router.put('/posts/:postId/delete', auth, softDeletePost); // Soft delete post (can be admin or author)
router.put('/posts/:postId/unflag', auth, isAdmin, unflagPost); // Unflag post (admin only)
router.get('/posts/flagged', auth, isAdmin, getFlaggedPosts); // Get all flagged posts (admin only)

export default router; 