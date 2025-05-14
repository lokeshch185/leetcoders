/**
 * User Score Calculation Utility
 * Calculates a user's overall score based on various LeetCode metrics
 * Uses weighted scoring system with normalized values
 */

/**
 * Calculates a user's overall score based on their LeetCode statistics
 * @param {Object} userData - User's LeetCode statistics
 * @param {Object} userData.problemStats - Problem solving statistics
 * @param {number} userData.acceptanceRate - Problem acceptance rate
 * @param {number} userData.reputation - User reputation
 * @param {number} userData.contestRating - Contest rating
 * @param {number} userData.totalContestsParticipated - Number of contests participated
 * @param {number} userData.currentStreak - Current solving streak
 * @param {number} userData.totalActiveDays - Total active days
 * @param {number} userData.ranking - Global ranking
 * @param {Array} userData.badges - User badges
 * @returns {number} Calculated score (0-100)
 */
const calculateScore = (userData) => {
  // Extract user data with default values
  const {
    problemStats = {},
    acceptanceRate = 0,
    reputation = 0,
    contestRating = 0,
    totalContestsParticipated = 0,
    currentStreak = 0,
    totalActiveDays = 0,
    ranking = 0,
    badges = []
  } = userData;

  // Get problem counts by difficulty
  const easyProblems = problemStats.easy || 0;
  const mediumProblems = problemStats.medium || 0;
  const hardProblems = problemStats.hard || 0;

  // Define maximum values for normalization
  const MAX_RANKING = 1_000_000;      // Maximum global ranking
  const MAX_ACCEPTANCE_RATE = 100;    // Maximum acceptance rate
  const MAX_CONTEST_RATING = 3000;    // Maximum contest rating
  const MAX_REPUTATION = 100_000;     // Maximum reputation
  const MAX_PROBLEM_SCORE = 500;      // Maximum problem score
  const MAX_CONTESTS = 100;           // Maximum contests participated
  const MAX_STREAK = 30;              // Maximum streak days
  const MAX_ACTIVE_DAYS = 365;        // Maximum active days
  const MAX_BADGES = 50;              // Maximum badges

  // Calculate problem score with weighted difficulty
  const problemScore = 
    easyProblems * 1.5 + 
    mediumProblems * 2.5 + 
    hardProblems * 3.5;

  // Normalize all metrics to values between 0 and 1
  const normalizedProblemScore = Math.min(problemScore, MAX_PROBLEM_SCORE) / MAX_PROBLEM_SCORE;
  const normalizedAcceptanceRate = Math.min(acceptanceRate, MAX_ACCEPTANCE_RATE) / MAX_ACCEPTANCE_RATE;
  const normalizedReputation = Math.min(reputation, MAX_REPUTATION) / MAX_REPUTATION;
  const normalizedContestRating = Math.min(contestRating, MAX_CONTEST_RATING) / MAX_CONTEST_RATING;
  const normalizedContests = Math.min(totalContestsParticipated, MAX_CONTESTS) / MAX_CONTESTS;
  const normalizedStreak = Math.min(currentStreak, MAX_STREAK) / MAX_STREAK;
  const normalizedActiveDays = Math.min(totalActiveDays, MAX_ACTIVE_DAYS) / MAX_ACTIVE_DAYS;
  const normalizedBadges = Math.min(badges.length, MAX_BADGES) / MAX_BADGES;
  const normalizedRanking = 1 - Math.min(ranking, MAX_RANKING) / MAX_RANKING;

  // Calculate final score using weighted sum
  const score = 
    normalizedProblemScore * 0.2 +           // 20% weight for problem solving
    normalizedAcceptanceRate * 0.15 +        // 15% weight for acceptance rate
    normalizedReputation * 0.1 +             // 10% weight for reputation
    normalizedRanking * 0.15 +               // 15% weight for ranking
    normalizedContestRating * 0.2 +          // 20% weight for contest rating
    normalizedContests * 0.1 +               // 10% weight for contest participation
    normalizedStreak * 0.05 +                // 5% weight for current streak
    normalizedActiveDays * 0.025 +           // 2.5% weight for active days
    normalizedBadges * 0.025;                // 2.5% weight for badges

  // Return score as integer between 0 and 100
  return Math.round(score * 100);
};

export { calculateScore };
