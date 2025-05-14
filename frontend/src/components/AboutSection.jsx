import { motion } from "framer-motion";
import leetcodeicon from "../assets/leetcode-icon.png"

const AboutSection = () => (
  <div className="bg-white py-16 px-8 flex flex-col lg:flex-row items-center justify-center lg:justify-between">
    <motion.div
      className="lg:w-1/2 mb-8 lg:mb-0"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold mb-4 text-gray-800">About Leetcoders</h2>
      <p className="text-gray-700 mb-6">
        Leetcoders is a vibrant, community-focused platform designed to foster growth, collaboration, and improvement among coders practicing on leetcode. We believe in the power of learning together and overcoming challenges as a community.
      </p>
      <p className="text-gray-700 mb-6">
        Our community offers tracking daily coding challenges, friendly challenges, and an inclusive leaderboard that tracks progress, celebrating everyone’s achievements. You can organize events and challenges to help coders push their limits.
      </p>
      <p className="text-gray-700 mb-6">
        Once you join Leetcoders, you'll have access to your leetcode personal profile, daily challenge reminders, friendly challenge options, and the leaderboard where you can see your growth among peers. Leetcoders is all about making coding engaging, motivational, and social.
      </p>
      <p className="text-gray-700 mb-6">
        Whether you’re just starting your leetcode journey or looking to polish your profile, Leetcoders provides the tools, structure, and community to help you grow. Join us and take part in building a supportive, inspiring environment.<b> HAPPY LEETCODING !!</b>
      </p>
    </motion.div>

    <motion.div
      className="lg:w-1/2 h-64 lg:h-auto bg-white rounded-lg"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
            <img
        src={leetcodeicon}
        alt="Community of Coders"
        className="w-52 object-cover rounded-lg mx-auto"
      />
    </motion.div>
  </div>
);

export default AboutSection;
