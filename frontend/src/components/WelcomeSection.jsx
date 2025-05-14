<section className="w-full py-20 text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-lg my-6">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Leecoders
        </motion.h1>
        <motion.p 
          className="mt-4 text-lg md:text-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Enhance your coding journey with daily challenges, leaderboards, and more.
        </motion.p>
        <motion.button 
          className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
      </section>