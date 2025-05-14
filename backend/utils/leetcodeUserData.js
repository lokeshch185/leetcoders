import fetch from 'node-fetch';

const fetchLeetcodeData = async (username) => {
  console.log(`Fetching data for user: ${username}`);

  const url = 'https://leetcode.com/graphql/';

  const query = `
    query CombinedQuery($username: String!, $year: Int) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        problemsSolved
        totalProblems
        finishTimeInSeconds
        ranking
        contest {
          title
          startTime
        }
      }
      matchedUser(username: $username) {
        activeBadge {
          displayName
          icon
        }
        contestBadge {
          name
          expired
          icon
        }
        username
        githubUrl
        twitterUrl
        linkedinUrl
        profile {
          ranking
          userAvatar
          realName
          aboutMe
          school
          websites
          countryName
          company
          jobTitle
          skillTags
          postViewCount
          postViewCountDiff
          reputation
          reputationDiff
          solutionCount
          solutionCountDiff
          categoryDiscussCount
          categoryDiscussCountDiff
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        problemsSolvedBeatsStats {
          difficulty
          percentage
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        badges {
          id
          name
          displayName
          icon
          medal {
            slug
            config {
              iconGif
            }
          }
          category
        }
        upcomingBadges {
          name
          icon
          progress
        }
        userCalendar(year: $year) {
          totalActiveDays
        }
        tagProblemCounts {
      advanced {
        tagName
        
        problemsSolved
      }
      intermediate {
        tagName
        
        problemsSolved
      }
      fundamental {
        tagName
        
        problemsSolved
      }
    }
      }
    }
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username, year: new Date().getFullYear() } }),
    });

    const data = await response.json();

    if (!data || !data.data || !data.data.matchedUser) {
      throw new Error('User not found on LeetCode');
    }

    const userData = data.data.matchedUser;
    const contestData = data.data.userContestRanking || {};
    const contestHistory = data.data.userContestRankingHistory || [];

    return {
      username: userData.username,
      profileImage: userData.profile.userAvatar,
      reputation: userData.profile.reputation,
      ranking: userData.profile.ranking,
      country: userData.profile.countryName,
      // company: userData.profile.company,
      // jobTitle: userData.profile.jobTitle,
      aboutMe: userData.profile.aboutMe,
      githubUrl: userData.githubUrl,
      twitterUrl: userData.twitterUrl,
      linkedinUrl: userData.linkedinUrl,
      badges: userData.badges || [],
      // upcomingBadges: userData.upcomingBadges || [],
      // activeBadge: userData.activeBadge || null,
      contestBadge: userData.contestBadge || null,
      problemStats: {
        easy: userData.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Easy')?.count || 0,
        medium: userData.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Medium')?.count || 0,
        hard: userData.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'Hard')?.count || 0,
      },
      problemCount: userData.submitStatsGlobal.acSubmissionNum.find(d => d.difficulty === 'All')?.count || 0,
      languageStats: userData.languageProblemCount || [],
      problemsSolvedBeatsStats: userData.problemsSolvedBeatsStats || [],
      postViewCount: userData.profile.postViewCount,
      // postViewCountDiff: userData.profile.postViewCountDiff,
      // reputationDiff: userData.profile.reputationDiff,
      solutionCount: userData.profile.solutionCount,
      // solutionCountDiff: userData.profile.solutionCountDiff,
      categoryDiscussCount: userData.profile.categoryDiscussCount,
      // categoryDiscussCountDiff: userData.profile.categoryDiscussCountDiff,
      contestRating: contestData.rating || 0,
      totalContestsParticipated: contestData.attendedContestsCount || 0,
      globalRanking: contestData.globalRanking || null,
      totalParticipants: contestData.totalParticipants || 0,
      topPercentage: contestData.topPercentage || 0,
      contestRankingHistory: contestHistory.map(history => ({
        attended: history.attended,
        problemsSolved: history.problemsSolved,
        totalProblems: history.totalProblems,
        finishTimeInSeconds: history.finishTimeInSeconds,
        ranking: history.ranking,
        contestTitle: history.contest.title,
        startTime: history.contest.startTime,
      })),
      MonthlyProgress: userData.upcomingBadges?.progress || 0,
      totalActiveDays: userData.userCalendar?.totalActiveDays || 0,
      tagProblemCounts: userData.tagProblemCounts,
    };
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    throw new Error(error.message);
  }
};

export default fetchLeetcodeData;
