import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ChallengeHistory from "../components/ChallengeHistory";
import ActiveChallenges from "../components/ActiveChallenges";

const ChallengePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [challengePopup, setChallengePopup] = useState(false);
  const [selectedCriterion, setSelectedCriterion] = useState("problemCount");
  const [endDate, setEndDate] = useState("");
  const [newChallenge, setNewChallenge] = useState(null);

  const userData =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    if (searchQuery.trim()) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/getsearcheduser?query=${searchQuery}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching user suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleUserSelect = (selected) => {
    setSelectedUser(selected);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleProfileRedirect = () => {
    window.open(`https://leetcode.com/u/${selectedUser.username}`, "_blank");
  };

  const toggleChallengePopup = () => {
    setChallengePopup(!challengePopup);
  };

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !endDate) {
      alert("Please select a user and provide an end date for the challenge.");
      return;
    }

    try {
      const challengeData = {
        challengerUsername: userData.username,
        opponentUsername: selectedUser.username,
        criterion: selectedCriterion,
        endDate,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenge/createchallenge`,
        challengeData
      );
      if (response.status === 201) {
        alert("Challenge created successfully!");
        toggleChallengePopup();
        setNewChallenge(response.data.challenge);
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge.");
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 sm:pt-6">
      <div className="flex flex-col sm:flex-row   max-w-3xl mx-auto">
        <div className="w-full sm:w-1/2 p-2  border-r-2  text-center">
          {userData && (
            <>
              <img
                src={userData.profileImage}
                alt={userData.realName}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold">{userData.realName}</h2>
              <p className="text-lg text-gray-600">@{userData.username}</p>
              <p className="text-xl font-semibold mt-2">
                Score: {userData.score}
              </p>
            </>
          )}
        </div>

        <div className={`w-full ${searchQuery ? 'min-h-[30vh]' : 'min-h-0'} lg:min-h-0 sm:w-1/2 p-6 md:p-4  overflow-y-auto  scrollbar-hide `}>
          {!selectedUser ? (
            <motion.div
              className="relative w-full mt-5 lg:mt-0"
              initial={{ top: "50%", transform: "translateY(-50%)" }}
              animate={{
                top: searchQuery ? "0%" : "50%",
                transform: searchQuery ? "translateY(0)" : "translateY(-50%)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="challenge a friend"
                className="w-full p-3 mt-5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg max-h-48 overflow-y-auto border border-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {suggestions.length > 0 ? (
                      suggestions.slice(0, 3).map((suggestedUser) => (
                        <div
                          key={suggestedUser.username}
                          className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
                          onClick={() => handleUserSelect(suggestedUser)}
                        >
                          <img
                            src={suggestedUser.profileImage}
                            alt={suggestedUser.username}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-semibold">
                              {suggestedUser.realName}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{suggestedUser.username}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No suggestions found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedUser(null)}
                className="self-start mt-0 text-gray-600 hover:text-gray-800"
              >
                &#8592; Back
              </button>

              <div className="flex items-center space-x-5 m-5">
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.realName}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-semibold">
                    {selectedUser.realName}
                  </h2>
                  <p className="text-lg text-gray-600">
                    @{selectedUser.username}
                  </p>
                  <p className="text-xl font-semibold ">
                    Score: {selectedUser.score}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleProfileRedirect}
                  className="px-6 py-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
                >
                  Profile
                </button>
                <button
                  onClick={toggleChallengePopup}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-500"
                >
                  Challenge
                </button>
              </div>
            </motion.div>
          )}

          {challengePopup && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">

              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <button
                  onClick={toggleChallengePopup}
                  className="self-start mb-4 text-gray-600 hover:text-gray-800"
                >
                  &#8592; Back
                </button>
                <h3 className="text-xl font-semibold mb-4">Create a Challenge</h3>
                <form onSubmit={handleChallengeSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600">
                      Select Criterion
                    </label>
                    <select
                      className="w-full p-2 border rounded-md mt-2"
                      value={selectedCriterion}
                      onChange={(e) => setSelectedCriterion(e.target.value)}
                    >
                      <option value="ranking">Ranking</option>
                      <option value="problemCount">Problem Count</option>
                      <option value="contestRating">Contest Rating</option>
                      <option value="totalActiveDays">Active Days</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded-md mt-2"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md w-full"
                  >
                    Submit Challenge
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
      <h3 className="text-3xl font-bold text-blue-600  ps-10 mb-2">
                Active Challenges
            </h3>
        <ActiveChallenges newChallenge={newChallenge} />
      </div>
      <div className="mt-8">
      <h3 className="text-3xl font-bold text-blue-600  ps-10 mb-2">
                Recent Challenges
            </h3>
        <ChallengeHistory />
      </div>
    </div>
  );
};

export default ChallengePage;
