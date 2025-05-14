import {useState} from "react";
import { motion } from "framer-motion";
import SignIn from "../pages/SignIn";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const HeroSection = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return(
  <div className=" bg-black text-white w-full h-full  px-6 text-center justify-center flex flex-col items-center">
     <h1 class="text-4xl lg:text-8xl  pb-6 font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-sky-200 to-white drop-shadow-lg">
    Leetcoders
  </h1>
    <motion.h1 
      initial={{ opacity: 0, y: -30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }}
      className="text-2xl lg:text-3xl font-bold mb-4"
    >
      Empowering Coders, Together.
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, delay: 0.2 }}
      className="text-lg mb-8"
    >
      Leecoders is a community-driven platform for coders to connect, grow, and learn together in a fun and challenging way.
    </motion.p>
    <motion.button 
      initial={{ opacity: 0, scale: 0.8 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg w-fit"
      onClick={toggleModal}
    >
      Join the Community  ^_^
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
  </div>);
};

export default HeroSection;
