import express from 'express';
import authRoutes from './authRoutes';
import classRoutes from './classRoutes';
import chatRoutes from './chatRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/api/classes', classRoutes);
router.use('/api', chatRoutes);

export default router; 