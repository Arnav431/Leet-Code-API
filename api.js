// LeetCode User Statistics API
// This API fetches user profile data including attempted questions and ranking

class LeetCodeAPI {
  constructor() {
    this.baseURL = 'https://leetcode.com/graphql';
  }

  /**
   * Fetch user profile statistics
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} User statistics including attempted questions and rank
   */
  async getUserStats(username) {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            realName
            aboutMe
            userAvatar
            reputation
            starRating
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
        }
      }
    `;

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: { username: username }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      if (!data.data.matchedUser) {
        throw new Error('User not found');
      }

      return this.formatUserStats(data.data);
    } catch (error) {
      throw new Error(`Failed to fetch user stats: ${error.message}`);
    }
  }

  /**
   * Format the raw API response into a clean structure
   * @param {Object} rawData - Raw data from LeetCode API
   * @returns {Object} Formatted user statistics
   */
  formatUserStats(rawData) {
    const { matchedUser, userContestRanking } = rawData;
    const { submitStats } = matchedUser;

    // Parse accepted submissions by difficulty
    const acceptedSubmissions = {};
    const totalSubmissions = {};

    submitStats.acSubmissionNum.forEach(item => {
      acceptedSubmissions[item.difficulty.toLowerCase()] = item.count;
    });

    submitStats.totalSubmissionNum.forEach(item => {
      totalSubmissions[item.difficulty.toLowerCase()] = item.count;
    });

    return {
      username: matchedUser.username,
      profile: {
        realName: matchedUser.profile.realName,
        ranking: matchedUser.profile.ranking,
        reputation: matchedUser.profile.reputation,
        avatar: matchedUser.profile.userAvatar,
        aboutMe: matchedUser.profile.aboutMe
      },
      problemsSolved: {
        easy: {
          solved: acceptedSubmissions.easy || 0,
          attempted: totalSubmissions.easy || 0
        },
        medium: {
          solved: acceptedSubmissions.medium || 0,
          attempted: totalSubmissions.medium || 0
        },
        hard: {
          solved: acceptedSubmissions.hard || 0,
          attempted: totalSubmissions.hard || 0
        },
        total: {
          solved: acceptedSubmissions.all || 0,
          attempted: totalSubmissions.all || 0
        }
      },
      contestRanking: userContestRanking ? {
        rating: Math.round(userContestRanking.rating),
        globalRank: userContestRanking.globalRanking,
        attendedContests: userContestRanking.attendedContestsCount,
        topPercentage: userContestRanking.topPercentage?.toFixed(2) + '%'
      } : null
    };
  }

  /**
   * Get only problem statistics (without contest info)
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} Problem solving statistics
   */
  async getProblemStats(username) {
    const stats = await this.getUserStats(username);
    return {
      username: stats.username,
      problemsSolved: stats.problemsSolved
    };
  }

  /**
   * Get user ranking information
   * @param {string} username - LeetCode username
   * @returns {Promise<Object>} User ranking details
   */
  async getUserRank(username) {
    const stats = await this.getUserStats(username);
    return {
      username: stats.username,
      globalRanking: stats.profile.ranking,
      contestRanking: stats.contestRanking
    };
  }
}

// Usage Examples:

// Initialize API
const leetcode = new LeetCodeAPI();

// Example 1: Get complete user statistics
async function getCompleteStats() {
  try {
    const stats = await leetcode.getUserStats('your_username');
    console.log('Complete Stats:', JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Get only problem statistics
async function getProblemStats() {
  try {
    const stats = await leetcode.getProblemStats('your_username');
    console.log('Problem Stats:', JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Get ranking information
async function getRankInfo() {
  try {
    const rank = await leetcode.getUserRank('your_username');
    console.log('Rank Info:', JSON.stringify(rank, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Uncomment to test:
// getCompleteStats();
// getProblemStats();
// getRankInfo();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LeetCodeAPI;
}