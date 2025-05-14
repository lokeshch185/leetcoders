/**
 * User Model Module
 * Defines the schema for user data including LeetCode statistics, profile information,
 * and social features
 */

import mongoose from 'mongoose';

/**
 * Problem Statistics Schema
 * Tracks the number of problems solved by difficulty level
 */
const ProblemStatsSchema = new mongoose.Schema({
  easy: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  hard: { type: Number, default: 0 },
});

/**
 * Language Statistics Schema
 * Tracks programming language proficiency and problem solving
 */
const LanguageStatsSchema = new mongoose.Schema({
  languageName: { type: String },
  problemsSolved: { type: Number, default: 0 },
});

/**
 * Badge Schema
 * Represents achievements and medals earned by the user
 */
const BadgeSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  displayName: { type: String },
  icon: { type: String },
  medal: {
    slug: { type: String },
    iconGif: { type: String },
  },
  category: { type: String },
});

/**
 * Contest History Schema
 * Records user's participation and performance in coding contests
 */
const ContestHistorySchema = new mongoose.Schema({
  attended: { type: Boolean, default: false },
  problemsSolved: { type: Number, default: 0 },
  totalProblems: { type: Number, default: 0 },
  finishTimeInSeconds: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  contestTitle: { type: String },
  startTime: { type: Number },
});

/**
 * Tag Schema
 * Represents problem tags and their associated statistics
 */
const tagSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true
  },
  problemsSolved: {
    type: Number,
    required: true
  }
});

/**
 * Tag Problem Counts Schema
 * Organizes problem tags by difficulty level
 */
const tagProblemCountsSchema = new mongoose.Schema({
  advanced: [tagSchema],
  intermediate: [tagSchema],
  fundamental: [tagSchema]
});

/**
 * User Schema
 * Main schema for user data including profile, statistics, and social features
 */
const UserSchema = new mongoose.Schema({
  // Authentication and Profile
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  realName: { type: String, default: '' },
  
  // Social Features
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Profile Information
  reputation: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  country: { type: String, default: '' },
  aboutMe: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  twitterUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  
  // LeetCode Statistics
  problemStats: { type: ProblemStatsSchema, default: () => ({}) },
  languageStats: [LanguageStatsSchema],
  problemCount: { type: Number, default: 0 },
  tagProblemCounts: { type: tagProblemCountsSchema, default: () => ({}) },
  
  // Activity Metrics
  postViewCount: { type: Number, default: 0 },
  solutionCount: { type: Number, default: 0 },
  categoryDiscussCount: { type: Number, default: 0 },
  totalActiveDays: { type: Number, default: 0 },
  
  // Contest Information
  contestRating: { type: Number, default: 0 },
  totalContestsParticipated: { type: Number, default: 0 },
  globalRanking: { type: Number, default: null },
  totalParticipants: { type: Number, default: 0 },
  topPercentage: { type: Number, default: 0 },
  contestRankingHistory: [ContestHistorySchema],
  
  // Achievements
  badges: [BadgeSchema],
  MonthlyProgress: { type: Number, default: 0 },
  contestBadge: {
    name: { type: String, default: '' },
    expired: { type: Boolean, default: false },
    icon: { type: String, default: '' },
  },
  
  // Learning Progress
  StriverSolvedQue: { type: Array },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
});

const User = mongoose.model('User', UserSchema);
export default User;
