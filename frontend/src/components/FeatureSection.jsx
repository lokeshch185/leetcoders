import { motion } from "framer-motion";

const features = [
  { title: "DCC Tracker", description: "Unlock new coding skills every day!! Never miss a daily coding challenge on leetcode again. Check out your friends submissions and learn a whole new approch.  Stay consistent, learn something new daily, and watch your skills level up.", icon: "🗓️" },
  { title: "Self Goals", description: "Push your limits with Self Challenges! Set personalized coding goals for leetcode that match your current skills and ambitions, and work toward them. Whether it’s mastering a new concept, or completing a set number of questions, Self Challenges are your opportunity to grow on your terms.", icon: " 🎯" },
  { title: "Friendly Challenges", description: "Bring out your competitive spirit with Friend Challenges! Invite your friends to friendly coding duels and see who can solve problems faster or more creatively. Strengthen bonds, learn from each other, and add a touch of excitement to your coding journey with some friendly rivalry.", icon: "🤝" },
  { title: "Leaderboard", description: "Climb the ranks and celebrate your progress with the Leetcoders Leaderboard! Track your growth as you master leetcode, and engage with the community. It’s not just about competition—it’s about celebrating every milestone along the way and staying motivated by seeing how far you and your peers have come.", icon: "🏆" },
];

const FeatureSection = () => (
  <div className="flex flex-wrap justify-around py-16 px-4 bg-[#2d7cf3]">
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="w-full text-3xl font-bold text-center text-white mb-10"
    >
      Key Features
    </motion.h2>
    {features.map((feature, index) => (
      <motion.div
        key={index}
        className="flex flex-col items-center text-center p-4 m-2 bg-white rounded-lg shadow-md w-72"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
      >
        <div className="text-4xl mb-4">{feature.icon}</div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-600">{feature.description}</p>
      </motion.div>
    ))}
  </div>
);

export default FeatureSection;
