import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link as ScrollLink } from 'react-scroll';
import SignIn from '../pages/SignIn';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <nav className="fixed w-full z-20 bg-[#f0f0f0]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-black text-xl font-bold">Leetcoders</span>
        </div>

        <div className="hidden sm:flex space-x-10 mx-10">
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            className="cursor-pointer text-black hover:text-gray-300 hover:scale-105 transform duration-200"
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            className="cursor-pointer text-black hover:text-gray-300 hover:scale-105 transform duration-200"
          >
            About
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className="cursor-pointer text-black hover:text-gray-300 hover:scale-105 transform duration-200"
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="faqs"
            smooth={true}
            duration={1000}
            className="cursor-pointer text-black hover:text-gray-300 hover:scale-105 transform duration-200"
          >
            FAQs
          </ScrollLink>
        </div>

        <button
          onClick={toggleModal}
          className="hidden sm:flex rounded-full border border-slate-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-900 hover:text-white hover:bg-slate-800 hover:border-slate-800"
        >
          Login
        </button>

        <div className="sm:hidden">
          <button
            onClick={toggleModal}
            className=" rounded-full border border-slate-400 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-900 hover:text-white hover:bg-slate-800 hover:border-slate-800"
          >
            Login
          </button>
        </div>
      </div>

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
    </nav>
  );
};

export default Navbar;
