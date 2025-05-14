/**
 * Leaderboard Routes Module
 * Handles API endpoints for accessing and updating the leaderboard
 * 
 * Routes:
 * - Leaderboard Access: get current rankings
 * - Leaderboard Update: update user statistics and rankings
 * 
 * @module routes/leaderboardRoutes
 */

import express from 'express';
import { getLeaderboard, updateLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

/**
 * Leaderboard Management Routes
 * Handles retrieving and updating leaderboard data
 */
router.get('/getboard', getLeaderboard);  // Get current leaderboard rankings
router.put('/updateboard', updateLeaderboard);  // Update leaderboard with latest user statistics

export default router;
