/**
 * Striver Sheet Routes Module
 * Handles API endpoints for accessing and managing Striver Sheet problems
 * 
 * Routes:
 * - Sheet Access: get all problems
 * - User Progress: get user's progress on the sheet
 * 
 * @module routes/StriverSheetRoutes
 */

import express from 'express';
import { getQuestions, getUserStriverSheet } from '../controllers/StriverSheetController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

/**
 * Striver Sheet Access Routes
 * Handles retrieving the problem sheet and user progress
 * User progress route requires authentication
 */
router.get('/getsheet', getQuestions);  // Get all problems in the Striver Sheet
router.get('/getusersheet', verifyToken, getUserStriverSheet);  // Get user's progress on the sheet (protected route)

export default router;
