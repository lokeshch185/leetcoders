/**
 * Daily Coding Challenge (DCC) Tracker Module
 * Manages daily coding challenges, tracks user progress, and sends reminders
 * Uses cron jobs to schedule various tasks
 */

import cron from 'node-cron';
import { DailyChallenge } from '../models/DailyCodingChallenge.js';
import { fetchDailyQuestion, fetchUserProgress } from '../utils/getDCCQuestion.js'; 
import moment from 'moment';
import User from '../models/User.js';
import getRecentSubmissions from '../utils/getRecentSubmissions.js';
import sendDailyChallengeReminder from '../utils/sendMail.js';

/**
 * Calculates the required progress for a user based on the current date
 * @param {number} daysBack - Number of days to look back (default: 1)
 * @returns {number} Required progress percentage
 */
const getRequiredProgress = (daysBack = 1) => {
  const today = moment();
  const currentDay = today.date();
  const daysInMonth = today.daysInMonth();
  return currentDay - daysBack <= 0 ? 0 : Math.floor((currentDay - daysBack) / daysInMonth * 100);
};

/**
 * Initializes the daily coding challenge
 * Runs at 00:05 AM every day
 * - Fetches the daily question
 * - Creates a new challenge record
 * - Initializes user tracking
 */
const InitDCC = cron.schedule('05 0 * * *', async () => {
  try {
    // Fetch today's challenge
    const { title, link, date } = await fetchDailyQuestion();
    const currentDate = moment().format('YYYY-MM-DD');
    
    // Create new daily challenge record
    const dailyChallenge = new DailyChallenge({
      date: date,
      title,
      link,
      unsolvedUsers: [],
      completedUsers: []
    });

    // Get all users and calculate required progress
    const users = await User.find().select('username');
    const requiredProgress = getRequiredProgress();

    // Check each user's progress
    const unsolvedUsers = await Promise.all(
      users.map(async (user) => {
        const { progress } = await fetchUserProgress(user.username);
        return progress === requiredProgress ? user.username : null;
      })
    );
    dailyChallenge.unsolvedUsers = unsolvedUsers.filter(Boolean); 

    await dailyChallenge.save();
    console.log(`Daily challenge for ${currentDate} initialized.`);
  } catch (error) {
    console.error('Error initializing daily challenge:', error);
  }
});

/**
 * Checks user progress on the daily challenge
 * Runs every 30 minutes
 * - Updates the list of unsolved users
 * - Records completed submissions
 */
const checkDCC = cron.schedule('*/30 * * * *', async () => {
  try {
    const now = moment();
    let currentDate = now.format('YYYY-MM-DD');
  
    // Find today's challenge
    const dailyChallenge = await DailyChallenge.findOne({ date: currentDate });
    if (!dailyChallenge) {
      return console.log('No daily challenge found for today.');
    }

    const dailyProblemTitle = dailyChallenge.title;

    // Check each unsolved user's recent submissions
    for (const username of dailyChallenge.unsolvedUsers) {
      const recentSubmissions = await getRecentSubmissions(username, 5);
     
      const submission = recentSubmissions.find(
        (submission) => submission.title === dailyProblemTitle
      );

      if (submission) {
        // Update user status if they've completed the challenge
        dailyChallenge.unsolvedUsers = dailyChallenge.unsolvedUsers.filter(
          (user) => user !== username
        );
        dailyChallenge.completedUsers.push({
          username,
          submissionId: submission.id,
          submissionTimestamp: new Date(submission.timestamp * 1000), 
        });
      }
    }

    await dailyChallenge.save();
    console.log(`Hourly check completed for ${currentDate}.`);
  } catch (error) {
    console.error('Error during hourly check:', error);
  }
});

/**
 * Sends reminder emails to users who haven't completed the daily challenge
 * Runs at 4:00 PM every day
 * - Finds users who haven't solved today's challenge
 * - Sends reminder emails with challenge details
 */
const DCCReminder = cron.schedule('0 16 * * *', async () => {
  try {
    const now = moment();
    let currentDate = now.format('YYYY-MM-DD');

    // Find today's challenge
    const dailyChallenge = await DailyChallenge.findOne({ date: currentDate });
    if (!dailyChallenge) {
      return console.log('No daily challenge found for today.');
    }

    const dailyProblemTitle = dailyChallenge.title;
    const dailyProblemLink = dailyChallenge.link;

    // Send reminders to unsolved users
    for (const username of dailyChallenge.unsolvedUsers) {
      const user = await User.findOne({ username }).select('email');
      const userEmail = user.email;
      if (userEmail) {
        await sendDailyChallengeReminder(userEmail, dailyProblemTitle, dailyProblemLink);
        console.log(`Reminder email sent to ${username} for daily challenge.`);
      }
    }

    console.log(`Reminder emails sent for unsolved users of ${currentDate}.`);
  } catch (error) {
    console.error('Error during 9 PM daily challenge check:', error);
  }
});

export { InitDCC, checkDCC, DCCReminder };