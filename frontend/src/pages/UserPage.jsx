import { useState, useEffect } from 'react';
import axios from 'axios';
import FriendSearch from '../components/FriendSearch';
import PendingRequests from '../components/PendingRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faLightbulb, faCode, faChartPie, faCrown, faFire, faStar } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import LoadingBar from '../components/LoadingBar';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const UserHomePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

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


  const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));

  const hasCompleted = challenge?.completedUsers.some(user => user.username === userData.username);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('No token found. Please sign in again.');
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/userdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
        sessionStorage.setItem('badges', JSON.stringify(response.data.user.badges));
      } catch (error) {
        setError('Error fetching user data. Please try again later.');
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (!user) {
    return <LoadingBar />;
  }

  const badgeCards = user.badges.map((badge) => (
    <div key={badge.displayName} className="flex flex-col items-center">
      <img
        src={badge.icon.startsWith('/') ? `https://leetcode.com${badge.icon}` : badge.icon}
        alt={badge.displayName}
        className="w-16 h-16  mb-2  hover:scale-105 transition-transform"
      />
      <p className="text-sm font-semibold text-gray-700">{badge.displayName}</p>
    </div>
  ));

  const problemData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problem Stats',
        data: [
          user.problemStats?.easy || 0,
          user.problemStats?.medium || 0,
          user.problemStats?.hard || 0,
        ],
        backgroundColor: ['#2cb255', '#feb600', '#f63737'],
        hoverOffset: 4,
      },
    ],
  };

  const languageData = {
    labels: user.languageStats?.map((stat) => stat.languageName) || [],
    datasets: [
      {
        label: 'Problems Solved by Language',
        data: user.languageStats?.map((stat) => stat.problemsSolved) || [],
        backgroundColor: ['#6C5DD3', '#00C1D4', '#FFC700', '#FF7F50'],
      },
    ],
  };

  const suggestions = [];
  if (user.totalActiveDays < 7) suggestions.push('Complete a 7-day activity streak!');
  if (user.contestRating < 1500) suggestions.push('Participate in contests to improve your rating.');
  if (user.problemStats?.hard === 0) suggestions.push('Try solving a hard problem!');
  if (user.languageStats?.length < 3) suggestions.push('Learn a new programming language.');
  if (user.globalRanking > 50000) suggestions.push('Aim to improve your global ranking through consistent participation!');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto max-w-7xl">
                <motion.div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 mb-8 shadow-xl"
          variants={itemVariants}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-block p-3 bg-yellow-400 rounded-full mb-4">
              <FontAwesomeIcon icon={faCrown} className="text-4xl text-yellow-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Welcome, {user.realName || user.username}!
            </h1>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm opacity-80">Global Rank</span>
                <p className="text-xl font-bold">#{user.globalRanking}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="text-sm opacity-80">Total Solved</span>
                <p className="text-xl font-bold">
                  {user.problemStats?.easy + user.problemStats?.medium + user.problemStats?.hard}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
                Badges & Achievements
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badgeCards}
              </div>
            </motion.div>

                        <motion.div 
              className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon icon={faFire} className="text-2xl" />
                <h3 className="text-xl font-bold">Daily Challenge</h3>
              </div>
              <p className="text-lg">
                {hasCompleted
                  ? '🎉 You\'ve completed today\'s challenge!'
                  : '🔥 Complete today\'s challenge to maintain your streak!'}
              </p>
            </motion.div>

                        <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartPie} className="text-blue-500" />
                    Problem Statistics
                  </h3>
                  <div className="relative h-64">
                    <Pie 
                      data={problemData} 
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              font: {
                                size: 14,
                                weight: '500'
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        },
                        maintainAspectRatio: false,
                        cutout: '60%'
                      }} 
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {user.problemStats?.easy + user.problemStats?.medium + user.problemStats?.hard}
                      </p>
                      <p className="text-sm text-gray-600">Total Solved</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="text-green-600 font-semibold">{user.problemStats?.easy || 0}</p>
                      <p className="text-xs text-gray-600">Easy</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <p className="text-yellow-600 font-semibold">{user.problemStats?.medium || 0}</p>
                      <p className="text-xs text-gray-600">Medium</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2">
                      <p className="text-red-600 font-semibold">{user.problemStats?.hard || 0}</p>
                      <p className="text-xs text-gray-600">Hard</p>
                    </div>
                  </div>
                </div>

                                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCode} className="text-green-500" />
                    Language Statistics
                  </h3>
                  <div className="relative h-64">
                    <Pie 
                      data={languageData} 
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              font: {
                                size: 14,
                                weight: '500'
                              }
                            }
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        },
                        maintainAspectRatio: false,
                        cutout: '60%'
                      }} 
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-2xl font-bold text-gray-800">
                        {user.languageStats?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600">Languages</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {user.languageStats?.slice(0, 4).map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-gray-800 font-semibold">{stat.languageName}</p>
                        <p className="text-sm text-gray-600">{stat.problemsSolved} problems</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

                    <div className="space-y-6">
                        <motion.div 
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              variants={itemVariants}
            >
              <div className="flex border-b">
                <button 
                  onClick={() => setActiveTab('search')} 
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'search' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Friends
                </button>
                <button 
                  onClick={() => setActiveTab('pending')} 
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === 'pending' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Requests
                </button>
              </div>
              <div className="p-4 max-h-[600px] overflow-y-auto">
                {activeTab === 'search' ? <FriendSearch /> : <PendingRequests />}
              </div>
            </motion.div>

                        <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
                Personalized Suggestions
              </h3>
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500"
                    >
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faStar} className="text-blue-500" />
                        <p className="text-gray-700">{suggestion}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">You're doing great! Keep it up. 🎉</p>
                  </div>
                )}
              </div>
            </motion.div>

                        <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Problem Tags</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {Object.entries(user.tagProblemCounts || {}).map(([level, tags]) => (
                  <div key={level} className="space-y-2">
                    <h4 className="text-lg font-semibold text-gray-700 capitalize">{level}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag.tagName}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all"
                        >
                          {tag.tagName} ({tag.problemsSolved})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
