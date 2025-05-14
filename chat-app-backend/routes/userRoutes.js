import express from 'express';
import {getFriends} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/friends',verifyToken, getFriends);

export default router;
