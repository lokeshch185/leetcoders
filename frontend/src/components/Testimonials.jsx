import { motion } from "framer-motion";

const testimonials = [
  { text: "Leecoders pushed my coding skills to new heights!", user: "User A" },
  { text: "Daily challenges keep me sharp and motivated.", user: "User B" },
];

const Testimonials = () => (
  <div className="bg-blue-50 py-16 px-6">
    <motion.h2 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="text-3xl font-bold text-center mb-10"
    >
      What Our Members Are Saying
    </motion.h2>
    <div className="flex flex-wrap justify-around">
      {testimonials.map((testimonial, index) => (
        <motion.div 
          key={index}
          className="bg-white p-6 m-4 rounded-lg shadow-lg w-64"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <p className="text-gray-800 italic">"{testimonial.text}"</p>
          <p className="mt-4 text-gray-600 font-semibold">— {testimonial.user}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Testimonials;
