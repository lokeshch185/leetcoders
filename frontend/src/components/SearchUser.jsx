import { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const SearchUser = ({ selectedUser, setSelectedUser, toggleChallengePopup }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!searchQuery.trim()) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/user/getsearcheduser?query=${searchQuery}`
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
        fetchSuggestions();
    }, [searchQuery]);

    return (
        <div className="relative">
            {!selectedUser ? (
                <motion.div
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
                        placeholder="Search user for challenge"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <AnimatePresence>
                        {suggestions.length > 0 && (
                            <motion.div
                                className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg max-h-48 overflow-y-auto border border-gray-200"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {suggestions.map((user) => (
                                    <div
                                        key={user.username}
                                        className="p-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <img
                                            src={user.profileImage}
                                            alt={user.username}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-semibold">{user.realName}</p>
                                            <p className="text-sm text-gray-500">
                                                @{user.username}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
        </div>
    );
};

export default SearchUser;
