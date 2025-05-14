/**
 * Leaderboard Controller Module
 * Handles leaderboard operations including retrieving rankings and updating user statistics
 */

import User from '../models/User.js';
import fetchLeetcodeData from '../utils/leetcodeUserData.js';
import { calculateScore } from '../utils/userScore.js';

/**
 * Get Leaderboard
 * Retrieves the current leaderboard with optional sorting and limit
 * @param {Object} req - Request object containing sort field and limit
 * @param {Object} res - Response object
 */
const getLeaderboard = async (req, res) => {
  // Default to sorting by score with a limit of 100 users
  const { sortField = 'score', limit = 100 } = req.query;

  try {
    // Fetch users sorted by specified field
    const users = await User.find()
      .sort({ [sortField]: -1 })  // Sort in descending order
      .limit(Number(limit))       // Limit number of results
      .select('username profileImage realName score'); // Select required fields

    res.status(200).json({ leaderboard: users });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

/**
 * Update Leaderboard
 * Updates statistics for all users by fetching latest data from LeetCode
 * This function is typically called by a scheduled task
 */
const updateLeaderboard = async () => {
  // Get all users from database
  const users = await User.find();
  
  // Update each user's statistics
  for (const user of users) {
    try {
      // Fetch latest data from LeetCode
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
};

export { getLeaderboard, updateLeaderboard };
