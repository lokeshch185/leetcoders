import { useState } from 'react';
import {motion} from 'framer-motion';
import SignIn from "../pages/SignIn";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
const JoinCommunity = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
  <section className="w-full bg-blue-600 text-white py-24 px-4 rounded-lg shadow-lg flex flex-col items-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-semibold text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Join Our Community Today
        </motion.h2>
        <motion.p 
          className="mt-4 text-lg text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Start your coding journey, track your progress, and compete with your friends.
        </motion.p>
        <motion.button 
          className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          whileHover={{ scale: 1.05 }}
          onClick={toggleModal}
        >
          Sign Up Now
        </motion.button>

        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative text-left bg-gray-100 p-5 rounded-lg shadow-lg md:max-w-md max-w-sm w-full">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <SignIn />
          </div>
        </div>
      )}

      </section>
);
}

export default JoinCommunity;
