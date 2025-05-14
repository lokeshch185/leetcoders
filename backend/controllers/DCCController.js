/**
 * Daily Coding Challenge (DCC) Controller Module
 * Handles operations related to daily coding challenges
 */

import { DailyChallenge } from "../models/DailyCodingChallenge.js";

/**
 * Get Today's Challenge
 * Retrieves the daily coding challenge for the current date
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getTodayChallenge = async (req, res) => {
    try {
      console.log("Fetching today's challenge");
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];
  
      // Find challenge for today's date
      const challenge = await DailyChallenge.findOne({ date: today });
  
      if (!challenge) {
        return res.status(404).json({ error: "No challenge found for today." });
      }
  
      res.status(200).json(challenge);
    } catch (error) {
      console.error("Error fetching today's challenge:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };

export {getTodayChallenge};