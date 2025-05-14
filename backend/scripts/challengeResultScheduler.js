/**
 * Challenge Result Scheduler Module
 * Automatically evaluates and updates results for both user-to-user challenges
 * and self-challenges that have reached their end date
 * Runs at midnight (00:00) every day
 */

import cron from 'node-cron';
import { Challenge, SelfChallenge } from '../models/Challenge.js'; 
import User from '../models/User.js'; 

/**
 * Evaluates and updates results for all challenges that have ended
 * Handles both user-to-user challenges and self-challenges
 */
export const ChallengeResults = cron.schedule('0 0 * * *', async () => {
  try {
    // Set up today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log("Today's date in UTC at midnight:", today);
    
    // Find all active challenges ending today
    const challengesToEvaluate = await Challenge.find({
      endDate: today,
      status: 'active', 
    });

    // Evaluate each user-to-user challenge
    for (const challenge of challengesToEvaluate) {
      const { challenger, opponent, criterion, _id } = challenge;

      // Get current values for both participants
      const challengerData = await User.findById(challenger).select(criterion);
      const opponentData = await User.findById(opponent).select(criterion);

      if (!challengerData || !opponentData) continue; 

      const challengerEndValue = challengerData[criterion];
      const opponentEndValue = opponentData[criterion];

      // Determine the winner based on the criterion
      let result = 'tie';
      if (challengerEndValue > opponentEndValue) {
        result = 'challenger';
      } else if (opponentEndValue > challengerEndValue) {
        result = 'opponent';
      }

      // Update challenge with results
      challenge.endValueChallenger = challengerEndValue;
      challenge.endValueOpponent = opponentEndValue;
      challenge.status = 'completed';
      challenge.result = result;
      await challenge.save();

      console.log(`Challenge ${_id} evaluated: Result is ${result}`);
    }

    console.log(`Daily challenge evaluation completed: ${challengesToEvaluate.length} challenges evaluated.`);
  } catch (error) {
    console.error('Error evaluating daily challenges:', error);
  }

  try {
    // Set up today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log("Today's date in UTC at midnight:", today);

    // Find all active self-challenges that have ended
    const activeChallenges = await SelfChallenge.find({
      status: 'active',
      endDate: { $lte: today },
    });

    // Evaluate each self-challenge
    for (const challenge of activeChallenges) {
      const { challenger, criterion, startValueChallenger, _id } = challenge;

      // Get user's current value for the criterion
      const user = await User.findById(challenger).select(criterion);
      if (!user) continue; 
      const currentValue = user[criterion];

      // Determine if the user achieved their goal
      const result = currentValue > startValueChallenger ? 'won' : 'lost';

      // Update self-challenge with results
      await SelfChallenge.findByIdAndUpdate(_id, {
        result,
        status: 'completed',
        endValueChallenger: currentValue,
      });

      console.log(`Self-Challenge ${_id} evaluated: Result is ${result}`);
    }

    console.log("Self-challenge results updated successfully.");
  } catch (error) {
    console.error("Error calculating self-challenge results:", error);
  }
});
