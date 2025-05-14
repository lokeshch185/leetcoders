/**
 * Recent Submissions Fetching Utility
 * Fetches a user's most recent accepted submissions from LeetCode
 * Uses LeetCode's GraphQL API to retrieve submission history
 */

/**
 * Fetches a user's most recent accepted submissions from LeetCode
 * @param {string} username - LeetCode username to fetch submissions for
 * @param {number} [limit=5] - Maximum number of recent submissions to fetch
 * @returns {Promise<Array>} Array of recent submissions with id, title, and timestamp
 * @returns {Promise<Array>} Empty array if fetch fails or no submissions found
 */
const getRecentSubmissions = async (username, limit = 5) => {
    // GraphQL query to fetch recent accepted submissions
    const query = `
      query recentAcSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `;
  
    // Query variables
    const variables = {
      username,
      limit,
    };
  
    try {
      // Make GraphQL API request
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });
  
      // Check for HTTP errors
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse and return submission data
      const data = await response.json();
      return data?.data?.recentAcSubmissionList || [];
    } catch (error) {
      // Log error and return empty array on failure
      console.error(`Error fetching recent submissions for ${username}:`, error.message);
      return [];
    }
};
  
export default getRecentSubmissions;
  