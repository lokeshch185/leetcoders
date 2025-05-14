/**
 * Challenge Routes Module
 * Handles API endpoints for user challenges and self-challenges
 * 
 * Routes:
 * - Challenge Creation: create user-to-user challenge, create self-challenge
 * - Challenge Management: end challenge
 * - Challenge Retrieval: get active, completed, and self challenges
 * 
 * @module routes/challengeRoutes
 */

import express from 'express';
import { createChallenge, createSelfChallenge, getActiveChallenges, getCompletedChallenges, getSelfChallenges, endChallenge } from '../controllers/challengeController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

/**
 * Challenge Creation Routes
 * Handles creating new challenges between users and self-challenges
 * Self-challenge creation requires authentication
 */
router.post('/createchallenge', createChallenge);  // Create a challenge between two users
router.post('/createselfchallenge', verifyToken, createSelfChallenge);  // Create a personal challenge (protected route)

/**
 * Challenge Management Routes
 * Handles ending active challenges
 */
router.put('/endchallenge/:challengeId', endChallenge);  // End an active challenge

/**
 * Challenge Retrieval Routes
 * Handles getting different types of challenges
 * All routes require authentication
 */
router.get('/getactivechallenge', verifyToken, getActiveChallenges);  // Get active challenges (protected route)
router.get('/getcompletedchallenge', verifyToken, getCompletedChallenges);  // Get completed challenges (protected route)
router.get('/getselfchallenge/', verifyToken, getSelfChallenges);  // Get self challenges (protected route)

export default router;
