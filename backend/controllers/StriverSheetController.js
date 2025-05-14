/**
 * Striver Sheet Controller Module
 * Handles operations related to Striver's Sheet questions and user progress tracking
 */

import { StriverSheet } from "../models/StriverSheet.js";
import User from '../models/User.js';

/**
 * Get Questions
 * Retrieves all questions from Striver's Sheet
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getQuestions = async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await StriverSheet.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

/**
 * Get User Striver Sheet
 * Retrieves Striver's Sheet questions with completion status for the authenticated user
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
const getUserStriverSheet = async (req, res) => {
  try {
    const { id } = req.userid;
    
    // Get user's completed questions
    const user = await User.findById(id).select("StriverSolvedQue");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a Set of completed question IDs for efficient lookup
    const completedQuestions = new Set(user.StriverSolvedQue);
    
    // Get all questions from Striver's Sheet
    const questions = await StriverSheet.find();

    // Map questions and add completion status
    const userSheet = questions.map((question) => ({
      ...question.toObject(),
      isCompleted: completedQuestions.has(question._id.toString()),
    }));
    
    res.status(200).json(userSheet);
  } catch (error) {
    console.error("Error fetching Striver progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getQuestions, getUserStriverSheet };
