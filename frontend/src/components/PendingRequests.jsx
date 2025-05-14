import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  const handleProfileRedirect = (username) => {
    navigate(`/userProfile/${username}`)
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/friend-requests/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(response.data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/friend-requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/friend-requests/reject/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <div>
      <ul className="max-h-60 overflow-y-auto">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <li key={request.id} className="flex  items-center mb-2 p-2 bg-gray-100">
              <img src={request.profileImage} onClick={() => handleProfileRedirect(request.username)} className='h-10 rounded-full hover:scale-105' alt={request.username} />
              <div
                className="ms-2 hover:underline cursor-pointer"
                onClick={() => handleProfileRedirect(request.username)}
              >
                <h1 className="font-semibold text-black">{request.realName}</h1>
                <h4 className="text-gray-600">{request.username}</h4>
              </div>

              <div className='ml-auto'>
                <button onClick={() => handleDecline(request.id)} className="text-gray-700 font-semibold">Ignore</button>
                <button onClick={() => handleAccept(request.id)} className="text-blue-500 font-semibold m-2 py-1 px-2 rounded-3xl border-blue-500 border-2 mr-2">Accept</button>
              </div>
            </li>
          ))
        ) : (
          <div className='font-semibold text-2xl text-gray-500 flex justify-center items-center'>No more request pending!!</div>
        )}
      </ul>
    </div>
  );
};

export default PendingRequests;