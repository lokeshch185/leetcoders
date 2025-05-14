import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const DailyChallengePage = () => {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/dcc/getdcc`
        );
        setChallenge(response.data);
      } catch (error) {
        console.error('Error fetching daily challenge:', error);
      }
    };
    fetchDailyChallenge();
  }, []);

  const badges = JSON.parse(sessionStorage.getItem('badges')) || [];
  const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
  const hasCompleted = challenge?.completedUsers.some(user => user.username === userData.username);


  return (

    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="flex-1 mr-4">
        {challenge ? (
          <motion.div
            className="bg-white shadow-lg rounded-lg p-6 mb-4 flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-blue-100 border-l-4 w-full border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md">
              <p className=""><span className="font-semibold">Note:</span> Status is updated every hour!!</p>
            </div>
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
              Today's Daily Coding Challenge Question
            </h2>
            <h2 className="text-xl font-semibold text-black m-4 text-center">
              {challenge.title}
            </h2>
            <a
              href={challenge.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 mx-auto bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500"
            >
              Solve Now
            </a>
          </motion.div>
        ) : (
          <p className="text-center text-gray-600">Loading today's challenge...</p>
        )}

        <div className="bg-white shadow-lg rounded-lg p-6 h-[calc(100vh-200px)]">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            Submission Stats
          </h3>
          <p className="text-gray-600 mb-2">
            Users Completed: {challenge?.completedUsers.length || 0} / {challenge?.unsolvedUsers.length}
          </p>
          <div className="grid grid-cols-1 gap-4 overflow-y-auto scrollbar-hide">
            {challenge?.completedUsers.map((user, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md bg-blue-50"
              >
                <h4 className="font-semibold text-gray-800">
                  {user.username}
                </h4>
                <a
                  href={`https://leetcode.com/submissions/detail/${user.submissionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2"
                >
                  View Submission
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 hidden md:block bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-6">
        <div className="bg-blue-600 text-white rounded-md p-4 text-center">
          <h3 className="text-xl font-bold mb-2">🔥 Current Streak</h3>
          <p className="text-lg">
            {hasCompleted
              ? 'You have completed today\'s challenge!'
              : 'Complete today\'s challenge to continue your streak!'}
          </p>
        </div>

        <div className="flex-1 bg-blue-50 rounded-md p-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            🏆 Badges & Rewards
          </h3>
          <div className="grid grid-cols-2 gap-4  overflow-y-auto scrollbar-hide">
            {badges.length > 0 ? (
              badges.map(badge => (
                <div
                  key={badge.displayName}
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      badge.icon.startsWith('/')
                        ? `https://leetcode.com${badge.icon}`
                        : badge.icon
                    }
                    alt={badge.displayName}
                    className="w-16 h-16 rounded-md mb-2"
                  />
                  <p className="text-sm font-semibold text-center">{badge.displayName}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No badges earned yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallengePage;
