import React, { useEffect, useState } from "react";
import axios from "axios";
import GoalCard from "../components/GoalCard";
import LoadingBar from "../components/LoadingBar";

const GoalsPage = () => {
  const [activeGoals, setActiveGoals] = useState([]);
  const [recentGoals, setRecentGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    criterion: "ranking",
    targetValueChallenger: "",
    endDate: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("No token found. Please sign in again.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/challenge/getselfchallenge`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { selfChallenges } = response.data;

      const active = selfChallenges.filter((goal) => goal.status === "active");
      const recent = selfChallenges.filter((goal) => goal.status === "completed");

      setActiveGoals(active);
      setRecentGoals(recent);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch goals.");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchGoals();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setMessage({ type: "error", text: "No token found. Please sign in again." });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenge/createselfchallenge`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage({ type: "success", text: "Goal created successfully!" });
      setFormData({ criterion: "ranking", targetValueChallenger: "", endDate: "" });
      fetchGoals();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create goal. Please try again." });
    }
  };

  if (loading) {
    return <LoadingBar/>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100  p-6 space-x-6">
      <div className="flex-1">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Goals 🚀</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => <GoalCard key={goal._id} goal={goal} />)
            ) : (
              <p className="text-center text-gray-500">No active goals at the moment.</p>
            )}
          </div>
        </div>
        <div className="mt-8 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Goals 📜</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[80vh] overflow-y-auto scrollbar-hide">
            {recentGoals.length > 0 ? (
              recentGoals.map((goal) => <GoalCard key={goal._id} goal={goal} />)
            ) : (
              <p className="text-center text-gray-500">No recent goals available.</p>
            )}
          </div>
        </div>
      </div>

      <aside className=" hidden md:block  w-1/4 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Set a New Goal</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Criterion</label>
              <select
                name="criterion"
                value={formData.criterion}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              >
                <option value="ranking">Ranking</option>
                <option value="problemCount">Problem Count</option>
                <option value="contestRating">Contest Rating</option>
                <option value="totalActiveDays">Total Active Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target</label>
              <input
                type="number"
                name="targetValueChallenger"
                value={formData.targetValueChallenger}
                onChange={handleInputChange}
                placeholder="Enter target value"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
            >
              Create Goal
            </button>
          </form>
          {message.text && (
            <p
              className={`mt-4 text-center text-sm ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Goal Suggestions</h3>
          <ul className="space-y-3 text-gray-700">
            <li>🌟 Solve 50 problems this week</li>
            <li>📈 Reach 200 active days</li>
            <li>🏆 Achieve 4 contest wins</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default GoalsPage;
