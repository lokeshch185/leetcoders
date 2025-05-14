import { motion } from "framer-motion";
import LeaderboardPage from "../assets/leaderboardPage.png";
import ChallengePage from "../assets/challengepage.png";

const LeaderboardPreview = () => (
  <div className="py-16 px-6 bg-white">
    <motion.div
      className="flex flex-col-reverse lg:flex-row items-center mb-12 lg:space-x-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lg:w-1/2 text-center lg:text-left p-2">
        <h2 className="text-3xl font-bold mb-4 text-sky-900">
          Climb the Leaderboard
        </h2>
        <p className="text-lg text-gray-700">
          The leaderboard highlights top performers, motivating members to
          improve and achieve their goals. Compete with peers and showcase your
          progress on leetcode every day.
        </p>
      </div>
      <div className="lg:w-1/2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-200  rounded-lg shadow-lg flex items-center justify-center"
        >
           <img src={LeaderboardPage} alt="leaderboard" className=" h-full object-cover rounded-lg" />
        </motion.div>
      </div>
    </motion.div>

    <motion.div
      className="flex flex-col lg:flex-row items-center lg:space-x-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="lg:w-1/2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-200 border-1 border-sky-200 rounded-lg shadow-lg flex items-center justify-center"
        >
           <img src={ChallengePage} alt="Your description" className="w-full h-full object-cover rounded-lg" />
        </motion.div>
      </div>
      <div className="lg:w-1/2 text-center lg:text-left mt-8 lg:mt-0 p-2">
        <h2 className="text-3xl font-bold mb-4 text-green-800">
          Stay Consistent
        </h2>
        <p className="text-lg text-gray-700">
          Do the daily coding challenge on leetcode. Share your solution with the community.
          Join in to stay updated, share your achievements and see how you stack up
          against the community.
        </p>
      </div>
    </motion.div>
  </div>
);

export default LeaderboardPreview;
