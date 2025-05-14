import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome, faTrophy, faShieldHalved, faCalendar, faGraduationCap, faEnvelope, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import FriendRequestPopup from './FriendRequestsPopup';
import Goal from '../assets/goal.png'


const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFriendRequestOpen, setIsFriendRequestOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/getsearcheduser?query=${e.target.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching for users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleProfileClick = (username) => {
    navigate(`/userProfile/${username}`)
    setSearchTerm('');
    setSearchResults([]);
    
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    navigate('/');

  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleFriendRequestPopup = () => {
    setIsFriendRequestOpen(!isFriendRequestOpen);
  };

  const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
  const handleAccountClick = () => {
    window.open(`https://leetcode.com/u/${userData.username}`, "_blank");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="container px-6 py-4 flex justify-between">
        <div className="flex items-center mr-10">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LEETCODERS
          </span>
        </div>

        <div className="relative hidden sm:flex w-1/4">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-200 rounded-lg py-2 px-14 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-lg"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-12 w-full max-h-60 overflow-y-auto">
              <ul>
                {searchResults.map((user) => (
                  <li key={user._id} onClick={() => handleProfileClick(user.username)} 
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <img src={user.profileImage} className='h-10 w-10 rounded-full object-cover border-2 border-gray-100'/>
                    <div className="ml-3">
                      <h3 className='font-semibold text-gray-900'>{user.username}</h3>
                      <span className='text-sm text-gray-500'>{user.realName}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hidden sm:flex space-x-7 mr-20">
          <Link
            to="/userPage"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faHome} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Home</span>
            </div>
          </Link>
          <Link
            to="/chat"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Messages</span>
            </div>
          </Link>
          <Link
            to="/leaderboard"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faTrophy} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Global</span>
            </div>
          </Link>
          <Link
            to="/challenges"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faShieldHalved} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Challenge</span>
            </div>
          </Link>
          <Link
            to="/goals"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <img src={Goal} className="h-6 w-6 mb-1" alt="Goals" />
              <span className="text-sm font-medium">Goals</span>
            </div>
          </Link>
          <Link
            to="/dcc"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faCalendar} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">DCC</span>
            </div>
          </Link>
          <Link
            to="/sheets"
            className="cursor-pointer text-gray-600 hover:text-blue-600 hover:scale-105 transform duration-200"
          >
            <div className='flex flex-col items-center'>
              <FontAwesomeIcon icon={faGraduationCap} className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Sheets</span>
            </div>
          </Link>
        </div>

        <div className="hidden sm:flex relative items-center">
          <img
            src={userData.profileImage}
            alt="User Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200"
            onClick={toggleProfileMenu}
          />
          {isProfileOpen && (
            <div className="absolute right-0 top-4 mt-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => { handleAccountClick(); setIsProfileOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                My Account
              </button>
              <button
                onClick={() => { toggleFriendRequestPopup(); setIsProfileOpen(false); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                Friend Requests
              </button>
              <button
                onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="sm:hidden">
          <button
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-4 z-50 bg-white p-4 h-screen w-screen sm:hidden shadow-lg">
          <Link
            to="/userPage"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/leaderboard"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            onClick={handleLinkClick}
          >
            Leaderboard
          </Link>
          <Link
            to="/challenges"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            onClick={handleLinkClick}
          >
            Challenges
          </Link>
          <Link
            to="/goals"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            onClick={handleLinkClick}
          >
            My Goals
          </Link>
          <Link
            to="/dcc"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            onClick={handleLinkClick}
          >
            Daily Challenge
          </Link>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => { handleAccountClick() }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-150"
            >
              My Account
            </button>
            <button
              onClick={() => { handleLogout() }}
              className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {isFriendRequestOpen && <FriendRequestPopup onClose={toggleFriendRequestPopup} />}
    </nav>
  );
};

export default UserNavbar;
