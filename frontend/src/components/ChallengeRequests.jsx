import { useEffect, useState } from "react";
import axios from "axios";

const ChallengeRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("No token found. Please sign in again.");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/challenge/getpendingrequests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingRequests(response.data.requests);
      } catch (err) {
        setError("Failed to fetch pending requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("No token found. Please sign in again.");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenge/approvechallenge`,
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      alert("Challenge approved successfully!");
    } catch (err) {
      alert("Failed to approve challenge.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading requests...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Pending Approvals</h3>
      {pendingRequests.length > 0 ? (
        <div className="space-y-4 overflow-y-auto h-[30vh] scrollbar-thin scrollbar-thumb-blue-500">
          {pendingRequests.map((request) => (
            <div
              key={request._id}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">{request.challengerName}</p>
                <p className="text-sm text-gray-600">
                  Criterion: {request.criterion} | End Date: {request.endDate}
                </p>
              </div>
              <button
                onClick={() => handleApprove(request._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No pending requests.</p>
      )}
    </div>
  );
};

export default ChallengeRequests;
