import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire} from '@fortawesome/free-solid-svg-icons';
const FriendSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const navigate = useNavigate();

  const handleProfileRedirect = (username) => {
    navigate(`/userProfile/${username}`)
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/friend-requests/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
        setFilteredFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const results = friends.filter(friend =>
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(results);
  }, [searchTerm, friends]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search friends..."
        className="border p-2 rounded w-full mb-4"
      />
      <ul className="max-h-60 overflow-y-auto">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <li key={friend._id} className="flex  items-center mb-2 p-2 border-b hover:bg-gray-100">
              <img src={friend.profileImage} className='h-10 rounded-full' alt={friend.username} />
              <div className='ms-2'>
              <h1 className='font-semibold text-black' >{friend.realName}</h1>
              <h4 className='text-gray-600' >{friend.username}</h4>
              </div>
              <div className='mx-auto flex items-center'> <FontAwesomeIcon icon={faFire} className="h-6 w-6 p-1 text-blue-600" />{friend.score}</div>
              <button
                  onClick={() => handleProfileRedirect(friend.username)}
                  className=" ml-auto px-6 py-2 m-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
                >
                  Profile
                </button>
            </li>
          ))
        ) : (
          <div className='font-semibold text-2xl text-gray-500 flex justify-center items-center '>Start with adding friends!</div>
        )}
      </ul>
    </div>
  );
};

export default FriendSearch;