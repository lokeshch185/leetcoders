import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const CreateChallengePopup = ({ selectedUser, toggleChallengePopup }) => {
  const [selectedCriterion, setSelectedCriterion] = useState("problemCount");
  const [endDate, setEndDate] = useState("");
  const userData =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));

  const handleChallengeSubmit = async (e) => {
    e.preventDefault();

    if (!endDate) {
      alert("Please provide an end date for the challenge.");
      return;
    }

    try {
      const challengeData = {
        challengerUsername: userData.username,
        opponentUsername: selectedUser.username,
        criterion: selectedCriterion,
        endDate,
      };

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenge/createchallenge`,
        challengeData,
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        alert("Challenge created successfully!");
        toggleChallengePopup();
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Failed to create challenge.");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-96"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <button
          onClick={toggleChallengePopup}
          className="self-start mb-4 text-gray-600 hover:text-gray-800"
        >
          &#8592; Back
        </button>
        <h3 className="text-xl font-semibold mb-4">Create a Challenge</h3>
        <form onSubmit={handleChallengeSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">Select Criterion</label>
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md w-full hover:bg-blue-500"
          >
            Submit Challenge
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateChallengePopup;
