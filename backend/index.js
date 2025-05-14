/**
 * Main server file for LeetCoders application
 * This file sets up the Express server, middleware, and routes
 */

// Import required dependencies
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import connectDB from './models/dbConnection.js'; 

// Import route handlers
import userRoutes from './routes/userRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import DCCRoutes from  './routes/DCCRoutes.js'
import StriverSheetRoutes from  './routes/StriverSheetRoutes.js'
import friendRequestRoutes from './routes/friendRequestRoutes.js';

// Import scheduled tasks
import { updateLeaderboard } from './scripts/updateLeaderBoard.js';
import { checkDCC, InitDCC } from './scripts/DCCTracker.js';
import { ChallengeResults } from './scripts/challengeResultScheduler.js';

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Initialize scheduled tasks
// These tasks run at specified intervals to update various aspects of the application
updateLeaderboard.start();  // Updates the leaderboard rankings
InitDCC.start();           // Initializes Daily Coding Challenge tracking
checkDCC.start();          // Checks and updates DCC status
ChallengeResults.start();  // Processes challenge results

// Configure CORS (Cross-Origin Resource Sharing)
// Restricts API access to specified frontend URL
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configure request body parsing
// Limits request size to prevent large payload attacks
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// Trust proxy for proper IP address handling
app.set('trust proxy', 1);

// Configure rate limiting
// Prevents brute force attacks by limiting requests per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiting to all routes
app.use(limiter);

// Add security headers using Helmet
app.use(helmet());

// API Routes
// Each route is prefixed with /api for better organization
app.use('/api/user', userRoutes);           // User authentication and profile management
app.use('/api/leaderboard', leaderboardRoutes); // Leaderboard functionality
app.use('/api/challenge', challengeRoutes); // Coding challenges
app.use('/api/dcc', DCCRoutes);            // Daily Coding Challenge routes
app.use('/api/striversheet', StriverSheetRoutes); // Striver's Sheet tracking
app.use('/api/friend-requests', friendRequestRoutes); // Friend request management

// Health check endpoint
app.get('/', (req, res) => {
   res.send("I'm live!!");
});

// Start the server
app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
