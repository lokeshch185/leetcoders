/**
 * User Routes Module
 * Handles all user-related API endpoints including authentication and profile management
 * 
 * Routes:
 * - Authentication: signup, signin
 * - Profile: user suggestions, user data, user profile
 * 
 * @module routes/userRoutes
 */

import express from 'express';
import { signin, signup, getUserSuggestions, getUserData, getUserProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authmiddleware.js';

const router = express.Router();

/**
 * Authentication Routes
 * Handles user registration and login
 */
router.post('/signup', signup);  // Register a new user
router.post('/signin', signin);  // Authenticate existing user

/**
 * User Profile Routes
 * Handles user profile data and search functionality
 * Most routes are protected and require authentication
 */
router.get('/getsearcheduser', getUserSuggestions);  // Get user suggestions for search
router.get('/userdata', verifyToken, getUserData);   // Get user data (protected route)
router.get('/userProfile', verifyToken, getUserProfile);  // Get detailed user profile (protected route)

export default router;
