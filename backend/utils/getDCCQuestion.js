/**
 * Daily Coding Challenge Question Utilities
 * Provides functions to interact with LeetCode's GraphQL API
 * for fetching daily challenges and user progress
 */

import fetch from 'node-fetch';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

/**
 * Fetches today's daily coding challenge from LeetCode
 * @returns {Promise<{date: string, title: string, link: string}>} Daily challenge information
 * @throws {Error} If the API request fails
 */
export const fetchDailyQuestion = async () => {
  const query = `
    query getDailyProblem {
      activeDailyCodingChallengeQuestion {
        date
        link
        question {
          title
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  const result = await response.json();
  const questionData = result.data.activeDailyCodingChallengeQuestion;

  return {
    date: questionData.date,
    title: questionData.question.title,
    link: `https://leetcode.com${questionData.link}`,
  };
};

/**
 * Fetches a user's progress on daily challenges
 * @param {string} username - LeetCode username
 * @returns {Promise<{progress: number}>} User's progress information
 * @throws {Error} If the API request fails
 */
export const fetchUserProgress = async (username) => {
  const query = `
    query userBadges($username: String!) {
      matchedUser(username: $username) {
        upcomingBadges {
          progress
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username }
    })
  });

  const result = await response.json();
  const progress = result.data.matchedUser.upcomingBadges[0]?.progress || 0;

  return { progress };
};
