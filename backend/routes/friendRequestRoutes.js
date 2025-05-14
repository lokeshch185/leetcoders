/**
 * Friend Request Routes Module
 * Handles all friend request related API endpoints
 * All routes require authentication
 * 
 * Routes:
 * - Friend Requests: send, get, accept, reject
 * - Friends: get friends list, remove friend
 * 
 * @module routes/friendRequestRoutes
 */

import express from 'express';
import { sendFriendRequest, getFriendRequests, rejectFriendRequest, acceptFriendRequest, removeFriend, getFriends } from '../controllers/friendRequestController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

/**
 * Friend Request Management Routes
 * Handles sending, accepting, and rejecting friend requests
 * All routes are protected and require authentication
 */
router.post('/send', verifyToken, sendFriendRequest);  // Send a new friend request
router.get('/requests', verifyToken, getFriendRequests);  // Get pending friend requests
router.put('/accept/:requestId', verifyToken, acceptFriendRequest);  // Accept a friend request
router.put('/reject/:requestId', verifyToken, rejectFriendRequest);  // Reject a friend request

/**
 * Friend Management Routes
 * Handles friend list operations
 * All routes are protected and require authentication
 */
router.delete('/remove/:friendId', verifyToken, removeFriend);  // Remove a friend
router.get('/friends', verifyToken, getFriends);  // Get list of friends

export default router;