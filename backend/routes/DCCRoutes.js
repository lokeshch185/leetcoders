/**
 * Daily Coding Challenge (DCC) Routes Module
 * Handles API endpoints for accessing daily coding challenges
 * 
 * Routes:
 * - Challenge Access: get today's challenge
 * 
 * @module routes/DCCRoutes
 */

import express from 'express';
import { getTodayChallenge } from '../controllers/DCCController.js';

const router = express.Router();

/**
 * Daily Challenge Access Route
 * Handles retrieving the current day's coding challenge
 */
router.get('/getdcc', getTodayChallenge);  // Get today's daily coding challenge

export default router;
