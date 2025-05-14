/**
 * Challenge Models Module
 * Defines schemas for user-to-user challenges and self-challenges
 */

import mongoose from 'mongoose';

/**
 * Challenge Schema
 * Represents a challenge between two users
 * @property {ObjectId} challenger - Reference to the user who initiated the challenge
 * @property {ObjectId} opponent - Reference to the user being challenged
 * @property {String} criterion - Metric being challenged (ranking/problemCount/contestRating/totalActiveDays)
 * @property {Number} startValueChallenger - Initial value of the challenger's metric
 * @property {Number} startValueOpponent - Initial value of the opponent's metric
 * @property {Number} endValueChallenger - Final value of the challenger's metric
 * @property {Number} endValueOpponent - Final value of the opponent's metric
 * @property {Date} startDate - When the challenge was created
 * @property {Date} endDate - When the challenge ends
 * @property {String} status - Current status of the challenge (active/completed)
 * @property {String} request - Status of the challenge request (accepted/rejected/pending)
 * @property {String} result - Outcome of the challenge (challenger/opponent/tie/pending)
 */
const ChallengeSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opponent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criterion: { type: String, enum: ['ranking', 'problemCount', 'contestRating', 'totalActiveDays'], required: true },
  startValueChallenger: { type: Number, required: true },
  startValueOpponent: { type: Number, required: true },
  endValueChallenger: { type: Number, required: false },
  endValueOpponent: { type: Number, required: false },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  request: { type: String, enum: ['accepted', 'rejected', 'pending'], default: 'pending' },
  result: { type: String, enum: ['challenger', 'opponent', 'tie', 'pending'], default: 'pending' }
});

/**
 * Self Challenge Schema
 * Represents a personal challenge set by a user
 * @property {ObjectId} challenger - Reference to the user who created the challenge
 * @property {String} criterion - Metric being challenged (ranking/problemCount/contestRating/totalActiveDays)
 * @property {Number} startValueChallenger - Initial value of the user's metric
 * @property {Number} endValueChallenger - Final value of the user's metric
 * @property {Number} targetValueChallenger - Target value to achieve
 * @property {Date} startDate - When the challenge was created
 * @property {Date} endDate - When the challenge ends
 * @property {String} status - Current status of the challenge (active/completed)
 * @property {String} result - Outcome of the challenge (won/lost/pending)
 */
const SelfChallengeSchema = new mongoose.Schema({
  challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criterion: { type: String, enum: ['ranking', 'problemCount', 'contestRating', 'totalActiveDays'], required: true },
  startValueChallenger: { type: Number, required: true },
  endValueChallenger: { type: Number, required: false },
  targetValueChallenger: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  result: { type: String, enum: ['won', 'lost', 'pending'], default: 'pending' }
});

export const Challenge = mongoose.model('Challenge', ChallengeSchema);
export const SelfChallenge = mongoose.model('SelfChallenge', SelfChallengeSchema);
  
