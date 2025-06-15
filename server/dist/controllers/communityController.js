"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlaggedPosts = exports.unflagPost = exports.flagPost = exports.softDeletePost = exports.toggleLike = exports.addComment = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const CommunityPost_1 = __importDefault(require("../models/CommunityPost"));
const mongoose_1 = __importDefault(require("mongoose"));
// @desc    Create a new community post
// @route   POST /api/community/posts
// @access  Private (User)
const createPost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { content } = req.body;
        if (!userId || !content) {
            return res.status(400).json({ success: false, message: 'User not authenticated or content is missing' });
        }
        const newPost = new CommunityPost_1.default({
            author: userId,
            content,
        });
        await newPost.save();
        // Populate author details for the response
        const populatedPost = await newPost.populate('author', 'name email');
        res.status(201).json({ success: true, data: populatedPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.createPost = createPost;
// @desc    Get all community posts (excluding deleted ones for users)
// @route   GET /api/community/posts
// @access  Public/Private (User/Admin)
const getPosts = async (req, res) => {
    try {
        // Admins can see all posts, users only non-deleted
        const filter = req.user?.role === 'admin' ? {} : { isDeleted: false };
        const posts = await CommunityPost_1.default.find(filter)
            .populate('author', 'name email') // Populate author details
            .populate('comments.author', 'name email') // Populate author details for comments
            .sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json({ success: true, data: posts });
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getPosts = getPosts;
// @desc    Get a single community post by ID
// @route   GET /api/community/posts/:postId
// @access  Public/Private
const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await CommunityPost_1.default.findById(postId)
            .populate('author', 'name email') // Populate author details
            .populate('comments.author', 'name email'); // Populate author details for comments
        if (!post || (post.isDeleted && req.user?.role !== 'admin')) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        console.error('Error fetching post by ID:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getPostById = getPostById;
// @desc    Add a comment to a community post
// @route   POST /api/community/posts/:postId/comments
// @access  Private (User)
const addComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { postId } = req.params;
        const { content } = req.body;
        if (!userId || !content) {
            return res.status(400).json({ success: false, message: 'User not authenticated or comment content is missing' });
        }
        const post = await CommunityPost_1.default.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const newComment = {
            author: userId,
            content,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        post.comments.push(newComment);
        await post.save();
        // Populate the author of the newly added comment for the response
        const savedPost = await CommunityPost_1.default.findById(postId)
            .populate('author', 'name email')
            .populate('comments.author', 'name email');
        // Find the newly added comment in the saved post to return it
        const addedComment = savedPost?.comments.find(comment => comment.content === content && comment.author._id.toString() === userId.toString() && comment.createdAt.getTime() === newComment.createdAt.getTime());
        res.status(201).json({ success: true, data: addedComment });
    }
    catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.addComment = addComment;
// @desc    Toggle like status for a community post
// @route   PUT /api/community/posts/:postId/like
// @access  Private (User)
const toggleLike = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { postId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const post = await CommunityPost_1.default.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        const userIdObjectId = new mongoose_1.default.Types.ObjectId(userId.toString());
        const likeIndex = post.likes.findIndex(likeId => likeId.equals(userIdObjectId));
        if (likeIndex === -1) {
            // User hasn't liked it, add like
            post.likes.push(userIdObjectId);
        }
        else {
            // User has liked it, remove like
            post.likes.splice(likeIndex, 1);
        }
        await post.save();
        res.status(200).json({ success: true, data: { likes: post.likes.length, liked: likeIndex === -1 } });
    }
    catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.toggleLike = toggleLike;
// Admin Actions
// @desc    Soft delete a community post (Admin/Author)
// @route   PUT /api/community/posts/:postId/delete
// @access  Private (Admin or Post Author)
const softDeletePost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const { postId } = req.params;
        if (!userId || !userRole) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const post = await CommunityPost_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        // Allow admin or the author to delete
        const isAuthor = post.author.equals(new mongoose_1.default.Types.ObjectId(userId.toString()));
        const isAdminUser = userRole === 'admin';
        if (!isAuthor && !isAdminUser) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }
        post.isDeleted = true;
        await post.save();
        res.status(200).json({ success: true, message: 'Post soft-deleted successfully' });
    }
    catch (error) {
        console.error('Error soft-deleting post:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.softDeletePost = softDeletePost;
// @desc    Flag a community post for moderation (User)
// @route   PUT /api/community/posts/:postId/flag
// @access  Private (User)
const flagPost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { postId } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        const post = await CommunityPost_1.default.findById(postId);
        if (!post || post.isDeleted) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        post.isFlagged = true;
        await post.save();
        res.status(200).json({ success: true, message: 'Post flagged for moderation' });
    }
    catch (error) {
        console.error('Error flagging post:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.flagPost = flagPost;
// @desc    Unflag a community post (Admin)
// @route   PUT /api/community/posts/:postId/unflag
// @access  Private (Admin)
const unflagPost = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const { postId } = req.params;
        if (!userId || userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const post = await CommunityPost_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        post.isFlagged = false;
        await post.save();
        res.status(200).json({ success: true, message: 'Post unflagged' });
    }
    catch (error) {
        console.error('Error unflagging post:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.unflagPost = unflagPost;
// @desc    Get all flagged community posts (Admin)
// @route   GET /api/community/posts/flagged
// @access  Private (Admin)
const getFlaggedPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        const userRole = req.user?.role;
        if (!userId || userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const flaggedPosts = await CommunityPost_1.default.find({ isFlagged: true, isDeleted: false })
            .populate('author', 'name email')
            .populate('comments.author', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: flaggedPosts });
    }
    catch (error) {
        console.error('Error fetching flagged posts:', error);
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
exports.getFlaggedPosts = getFlaggedPosts;
