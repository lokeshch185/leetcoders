import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleProfileRedirect = (username) => {
    navigate(`/userProfile/${username}`)
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leaderboard/getboard`
        );
        const data = await response.json();
        setUsers(data.leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboardData();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let topUsers = [...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  topUsers = [topUsers[1], topUsers[0], topUsers[2]].filter(Boolean);


  return (
    <div className="p-8 bg-gradient-to-b from-white to-blue-300 ">
      <div className="bg-blue-100 border-l-4 w-full border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md">
        <p className=""><span className="font-semibold">Note:</span> Score is calculated based on your leetcode stats, and is updated everyday at midnight.</p>
      </div>

      
      <div className="flex justify-center items-center mb-10">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by username..."
            className="w-full p-4 pl-12 rounded-full border-2 border-blue-300 focus:ring-1 focus:ring-blue-500 shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faUserCircle}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-blue-400 text-xl"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-300 h-12 w-12"></div>
          <style>
            {`
            .loader {
              border-top-color: #f6ad55;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            `}
          </style>
        </div>
      ) : (
        <div>
          <div className="flex md:flex-row flex-col justify-center gap-4 items-center m-14">
            {topUsers.map((user, index) => (
              <motion.div
                key={user.username}
                className={`relative bg-gradient-to-tr from-yellow-200  via-yellow-300 to-yellow-200 p-6 rounded-xl shadow-lg w-60 h-40 ${index === 1 ? "w-64 h-56 " : "scale-100"
                  }`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <img
                    src={user.profileImage || "https://placehold.co/100x100"}
                    alt={user.username}
                    className="rounded-full w-20 h-20 border-4 border-blue-400 shadow-md"
                  />
                </div>
                <div className="text-center mt-10">
                  <h2 className="text-xl font-bold text-gray-800">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-500">{user.realName}</p>
                  <p className="text-2xl font-semibold text-blue-600">
                    {user.score} pts
                  </p>
                  <p className="absolute top-2 left-2 text-gray-400 text-3xl font-bold">
                    {index === 1 ? "🥇" : index === 0 ? "🥈" : "🥉"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className=" space-y-4 h-[80vh] overflow-y-auto scrollbar-hide w-full max-w-3xl flex-col justify-center items-center mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {filteredUsers.map((user, index) => (
              <div
                key={user.username}
               
                className="flex justify-between items-center space-x-5 bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 mx-auto w-full max-w-xl flex-shrink-0"
              >
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-blue-600">
                    #{index + 1}
                  </div>
                  <img
                    src={user.profileImage || "https://placehold.co/50x50"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.realName}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Score</p>
                  <p className="text-lg font-bold text-gray-700">
                    {user.score}
                  </p>
                </div>
                <button
                  onClick={() => handleProfileRedirect(user.username)}
                  className="hidden md:block px-6 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
                >
                  Profile
                </button>
              </div>
            ))}
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
