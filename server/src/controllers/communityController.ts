import { Request, Response } from 'express';
import CommunityPost, { ICommunityPost, IComment } from '../models/CommunityPost';
import { Content } from '../models/Content';
import { IUser } from '../models/User'; // Assuming IUser is exported from User model
import mongoose from 'mongoose';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: IUser;
}

// @desc    Create a new community post
// @route   POST /api/community/posts
// @access  Private (User)
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ success: false, message: 'User not authenticated or content is missing' });
    }

    const newPost = new CommunityPost({
      author: userId,
      content,
    });

    await newPost.save();

    // Populate author details for the response
    const populatedPost = await newPost.populate('author', 'name email');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all community posts (excluding deleted ones for users)
// @route   GET /api/community/posts
// @access  Public/Private (User/Admin)
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    // Admins can see all posts, users only non-deleted
    const filter = req.user?.role === 'admin' ? {} : { isDeleted: false };

    const posts = await CommunityPost.find(filter)
      .populate('author', 'name email') // Populate author details
      .populate('comments.author', 'name email') // Populate author details for comments
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get a single community post by ID
// @route   GET /api/community/posts/:postId
// @access  Public/Private
export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await CommunityPost.findById(postId)
       .populate('author', 'name email') // Populate author details
       .populate('comments.author', 'name email'); // Populate author details for comments

    if (!post || (post.isDeleted && req.user?.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Add a comment to a community post
// @route   POST /api/community/posts/:postId/comments
// @access  Private (User)
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ success: false, message: 'User not authenticated or comment content is missing' });
    }

    const post = await CommunityPost.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const newComment = {
      author: userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    post.comments.push(newComment as IComment);
    await post.save();

     // Populate the author of the newly added comment for the response
    const savedPost = await CommunityPost.findById(postId)
       .populate('author', 'name email')
       .populate('comments.author', 'name email');

    // Find the newly added comment in the saved post to return it
    const addedComment = savedPost?.comments.find(comment => comment.content === content && comment.author._id.toString() === userId.toString() && (comment as any).createdAt.getTime() === (newComment as any).createdAt.getTime());

    res.status(201).json({ success: true, data: addedComment });
  } catch (error: any) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Toggle like status for a community post
// @route   PUT /api/community/posts/:postId/like
// @access  Private (User)
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const post = await CommunityPost.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userIdObjectId = new mongoose.Types.ObjectId(userId.toString());
    const likeIndex = post.likes.findIndex(likeId => likeId.equals(userIdObjectId));

    if (likeIndex === -1) {
      // User hasn't liked it, add like
      post.likes.push(userIdObjectId);
    } else {
      // User has liked it, remove like
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({ success: true, data: { likes: post.likes.length, liked: likeIndex === -1 } });
  } catch (error: any) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// Admin Actions

// @desc    Soft delete a community post (Admin/Author)
// @route   PUT /api/community/posts/:postId/delete
// @access  Private (Admin or Post Author)
export const softDeletePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const { postId } = req.params;

    if (!userId || !userRole) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Allow admin or the author to delete
    const isAuthor = post.author.equals(new mongoose.Types.ObjectId(userId.toString()));
    const isAdminUser = userRole === 'admin';

    if (!isAuthor && !isAdminUser) {
       return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({ success: true, message: 'Post soft-deleted successfully' });

  } catch (error: any) {
    console.error('Error soft-deleting post:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Flag a community post for moderation (User)
// @route   PUT /api/community/posts/:postId/flag
// @access  Private (User)
export const flagPost = async (req: AuthRequest, res: Response) => {
   try {
    const userId = req.user?._id;
    const { postId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const post = await CommunityPost.findById(postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.isFlagged = true;
    await post.save();

    res.status(200).json({ success: true, message: 'Post flagged for moderation' });

  } catch (error: any) {
    console.error('Error flagging post:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Unflag a community post (Admin)
// @route   PUT /api/community/posts/:postId/unflag
// @access  Private (Admin)
export const unflagPost = async (req: AuthRequest, res: Response) => {
   try {
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const { postId } = req.params;

    if (!userId || userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const post = await CommunityPost.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.isFlagged = false;
    await post.save();

    res.status(200).json({ success: true, message: 'Post unflagged' });

  } catch (error: any) {
    console.error('Error unflagging post:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all flagged community posts (Admin)
// @route   GET /api/community/posts/flagged
// @access  Private (Admin)
export const getFlaggedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!userId || userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const flaggedPosts = await CommunityPost.find({ isFlagged: true, isDeleted: false })
       .populate('author', 'name email')
       .populate('comments.author', 'name email')
       .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: flaggedPosts });
  } catch (error: any) {
    console.error('Error fetching flagged posts:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
}; 