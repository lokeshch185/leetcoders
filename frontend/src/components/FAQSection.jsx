import { useState } from 'react';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is Leetcoders, and who is it for?',
      answer: " Leetcoders is a community-driven platform created for coders who practise on leetcode and want to engage with a community to stay motivated and consistent. It’s designed to be a collaborative space where members can track daily coding challenges from leetcode, set self-goals for leetcode, and participate in friendly competitions. Leetcoder is build on top of leetcode api, all the data is fetched from leetcode." },
    {
      question: 'How does the Daily Challenge Tracker works?',
      answer: 'Every day, Leetcode releases a new coding problem as part of the Daily Coding Challenge. We fetch this data from leetcode and help members complete them. Members are reminded of completing the challenge, build a daily streak, and also see and learn from other members submission.'
    },
    {
      question: 'Can I challenge my friends on Leetcoders?',
      answer: 'Absolutely! Leetcoders includes a "Friendly Challenge" feature along with "self goals" feature where you can invite friends to a coding duel. Simply choose the challenge type, the duration and start it with you frined. You and your friend can then solve the questions on leetcode platform till the time ends. The results are then calculated and displayed. It’s a fun way to learn and motivate each other!'
    },
    {
      question: 'What kind of support does Leetcoders provide for skill-building?',
      answer: 'The leaderboard, self-challenges, and daily tasks are all designed to encourage consistent practice. Our platform also fosters collaboration, so you can learn from peers. We plan to soon add support for in-platform discussions, community events, coding resources that help build your skills in a collaborative environment.'
    }
  ];

  return (
    <motion.section
      className="h-auto bg-white p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="p-5 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="cursor-pointer flex justify-between items-center"
            >
              <h3 className="text-lg font-semibold">{faq.question}</h3>
              <span>{activeIndex === index ? '-' : '+'}</span>
            </div>
            {activeIndex === index && (
              <motion.p className="mt-4 text-gray-600" initial={{ height: 0 }} animate={{ height: 'auto' }}>
                {faq.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default FAQSection;
