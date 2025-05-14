import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const StriverSheet = () => {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/striversheet/getusersheet`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const questionsWithStatus = response.data.map((q) => ({
          ...q,
          isCompleted: q.isCompleted || false,
        }));
        setQuestions(questionsWithStatus);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    filter ? q.tags.includes(filter) : true
  );

  const handleSolveNow = (quesLink) => {
    window.open(`${quesLink}`, "_blank");
  };

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 min-h-screen text-gray-900">
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-md">
  <p className="font-semibold">Note:</p>
  <p>Our auto-tracking feature is coming soon! Stay tuned for seamless updates on your solved questions.</p>
</div>

      <motion.div
        className="flex flex-col lg:flex-row justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        
        <h1 className="text-2xl font-bold text-blue-500 mb-4 lg:mb-0">
          Striver's Sheet
        </h1>
        <select
          className="bg-white text-black p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Filter by Tag</option>
          {Array.from(new Set(questions.flatMap((q) => q.tags))).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        className="overflow-auto h-screen custom-scrollbar shadow-xl rounded-lg bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-semibold">Index</th>
              <th className="p-4 text-sm font-semibold">Question Name</th>
              <th className="p-4 text-sm font-semibold">Tags</th>
              <th className="p-4 text-sm font-semibold">Day</th>
              <th className="p-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q, index) => (
                <motion.tr
                  key={q._id}
                  className={`border-t hover:bg-gray-300 transition duration-200 ${
                    q.isCompleted ? "bg-green-100" : "bg-gray-100"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="p-4 text-sm">{index + 1}</td>
                  <td className="p-4 text-sm">
                    <a
                      href={q.quesLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {q.quesName}
                    </a>
                  </td>
                  <td className="p-4 text-sm">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-700 text-white px-2 py-1 my-1 rounded-full text-xs mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-sm">{q.specialTag}</td>
                  <td className="p-4">
                    {q.isCompleted ? (
                      <span className="text-green-500 font-bold">Solved</span>
                    ) : (
                      <button
                        onClick={() => handleSolveNow(q.quesLink)}
                        className="bg-yellow-500 px-3 py-1 rounded-full text-sm text-white hover:bg-yellow-600 focus:ring focus:ring-yellow-400 transition"
                      >
                        Solve Now
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-400">
                  No questions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default StriverSheet;
