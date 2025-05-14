/**
 * Leaderboard Update Script
 * Automatically updates user statistics and scores daily
 * Runs at 00:15 AM every day
 */

import cron from 'node-cron';
import User from '../models/User.js';
import fetchLeetcodeData from '../utils/leetcodeUserData.js';
import { calculateScore } from '../utils/userScore.js';

/**
 * Updates the leaderboard by fetching and processing user data
 * - Fetches latest LeetCode data for each user
 * - Calculates updated scores
 * - Updates user records in the database
 */
const updateLeaderboard = cron.schedule('15 0 * * *', async () => {
  // Get all users from the database
  const users = await User.find().select('username');
  
  // Update each user's data
  for (const user of users) {
    try {
      console.log('started updating leaderboard');
      // Fetch latest LeetCode data
      const updatedData = await fetchLeetcodeData(user.username);
      
      // Calculate new score based on updated data
      updatedData.score = calculateScore(updatedData);

      // Update user record in database
      await User.findByIdAndUpdate(user._id, updatedData);
      console.log(`Updated stats for ${user.username}`);
    } catch (error) {
      console.error(`Failed to update data for ${user.username}:`, error.message);
    }
  }
});

export { updateLeaderboard };
