/**
 * Daily Coding Challenge Model Module
 * Defines the schema for daily coding challenges and user submissions
 */

import mongoose from 'mongoose';

/**
 * Daily Challenge Schema
 * Represents a daily coding challenge and tracks user participation
 * @property {String} date - Unique date identifier for the challenge
 * @property {String} title - Title of the coding challenge
 * @property {String} link - URL link to the challenge
 * @property {String[]} unsolvedUsers - List of usernames who haven't solved the challenge
 * @property {Object[]} completedUsers - List of users who completed the challenge
 * @property {String} completedUsers.username - Username of the user who completed the challenge
 * @property {String} completedUsers.submissionId - ID of the submission
 * @property {Date} completedUsers.submissionTimestamp - When the challenge was completed
 */
const DailyChallengeSchema = new mongoose.Schema({
  date: { type: String, unique: true }, 
  title: String, 
  link: String, 
  unsolvedUsers: [String], 
  completedUsers: [
    {
      username: String, 
      submissionId: String,
      submissionTimestamp: { type: Date, default: Date.now } 
    }
  ]
});

export const DailyChallenge = mongoose.model('DailyCodingChallenge', DailyChallengeSchema);

