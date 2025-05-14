import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const GoalForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        alert("No token found. Please sign in again.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenge/createselfchallenge`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Goal created successfully!");
        reset();
      } else {
        alert("Failed to create the goal. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while creating the goal.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-lg flex flex-col space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">Set a New Goal</h2>

      <div>
        <label htmlFor="criterion" className="block text-gray-600 font-medium mb-2">
          Criterion
        </label>
        <select
          {...register("criterion", { required: "Please select a criterion." })}
          id="criterion"
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Select a Criterion</option>
          <option value="ranking">Ranking</option>
          <option value="problemCount">Problem Count</option>
          <option value="contestRating">Contest Rating</option>
          <option value="totalActiveDays">Total Active Days</option>
        </select>
        {errors.criterion && <p className="text-red-500 text-sm mt-1">{errors.criterion.message}</p>}
      </div>

      <div>
        <label htmlFor="targetValueChallenger" className="block text-gray-600 font-medium mb-2">
          Target Value
        </label>
        <input
          type="number"
          id="targetValueChallenger"
          {...register("targetValueChallenger", {
            required: "Please enter a target value.",
            min: { value: 1, message: "Target value must be greater than 0." },
          })}
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="Enter target value"
        />
        {errors.targetValueChallenger && (
          <p className="text-red-500 text-sm mt-1">{errors.targetValueChallenger.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block text-gray-600 font-medium mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          {...register("endDate", { required: "Please select an end date." })}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Create Goal
      </button>
    </form>
  );
};

export default GoalForm;
