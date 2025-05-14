import { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequestPopup = ({ onClose }) => {
  const [pendingRequests, setPendingRequests] = useState([]);

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
      await axios.put(`${import.meta.env.VITE_API_URL}/api/friend-requests/reject/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId)); 
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w -full max-w-md">
        <h2 className="text-lg font-bold mb-4">Pending Friend Requests</h2>
        <ul>
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <li key={request.id} className="flex justify-between items-center mb-2">
                <span>{request.username}</span>
                <div>
                  <button onClick={() => handleAccept(request.id)} className="text-green-500 mr-2">Accept</button>
                  <button onClick={() => handleDecline(request.id)} className="text-red-500">Decline</button>
                </div>
              </li>
            ))
          ) : (
            <li>No pending requests</li>
          )}
        </ul>
        <button onClick={onClose} className="mt-4 text-blue-500">Close</button>
      </div>
    </div>
  );
};

export default FriendRequestPopup;