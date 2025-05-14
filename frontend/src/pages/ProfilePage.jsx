import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCode, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import leetcodeBanner from '../assets/leetcode-banner.png'
import { Pie } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import LoadingBar from '../components/LoadingBar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const UserProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('none');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setError('No token found. Please sign in again.');
          return;
        }

        const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/userProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username,
          },
        });
        console.log(userResponse.data.user)
        setUser(userResponse.data.user);
        setStatus(userResponse.data.status);
      } catch (error) {
        setError('Error fetching user data. Please try again later.');
        console.error(error);
      }
    };

    fetchUserData();
  }, [username]);

  const handleProfileRedirect = (username) => {
    window.open(`https://leetcode.com/u/${username}`, "_blank");
  };

  const handleConnect = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/friend-requests/send`,
        { receiverId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Friend request sent!');
      setStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again later.');
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  if (!user) {
    return <LoadingBar />;
  }

  return (
    <div className="bg-[#f4f2ee] min-h-screen p-6">
      <div className="container mx-auto max-w-screen-lg">
        <div className="relative mb-6">
          <div
            className="h-40 md:h-60 bg-fit bg-center rounded-lg shadow-lg"
            style={{
              backgroundImage: `url(${leetcodeBanner})`, backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          <div className=" bg-white p-4 relative -mt-12 md:-mt-16 flex flex-col md:flex-row items-center gap-4 px-6">
            <img
              src={user.profileImage || 'https://via.placeholder.com/150'}
              alt={user.realName || user.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">{user.realName || 'User'}</h1>
              <p className="text-sm md:text-lg text-gray-600">@{user.username}</p>
              <div className="mt-4">
              {status === 'accepted' ? (
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md">
                    Connected
                  </button>
                ) : status === 'pending' ? (
                  <button
                    disabled
                    className="bg-orange-400 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Pending
                  </button>
                ) : (
                  <button
                    onClick={handleConnect}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600"
                  >
                    Connect
                  </button>
                )}
                <button
                  onClick={() => handleProfileRedirect(user.username)}
                  className="px-6 py-2 m-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700"
                >
                  Leetcode
                </button>
              </div>
            </div>
            <div className="text-gray-800 text-center md:text-right">
              <p className="text-sm md:text-lg font-semibold">Global Ranking: #{user.globalRanking}</p>
              <p className="text-sm md:text-lg font-semibold">Contest Rating: {user.contestRating}</p>
              <div className="flex gap-4 justify-center md:justify-end mt-2">
                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                  </a>
                )}
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} /> Badges & Achievements
            </h3>
            <div className="flex flex-wrap gap-4 max-h-52 justify-center overflow-y-auto scrollbar-hide">
              {user.badges.map((badge) => (
                <div key={badge.displayName} className="flex flex-col items-center">
                  <img
                    src={badge.icon.startsWith('/') ? `https://leetcode.com${badge.icon}` : badge.icon}
                    alt={badge.displayName}
                    className="w-16 h-16 mb-2 hover:scale-105 transition-transform"
                  />
                  <p className="text-sm font-semibold text-gray-700">{badge.displayName}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartPie} /> Problems Solved -{' '}
              {user.problemStats?.easy + user.problemStats?.medium + user.problemStats?.hard}
            </h3>
            <div className="w-full h-56 flex flex-col items-center">
              <Pie
                data={{
                  labels: ['Easy', 'Medium', 'Hard'],
                  datasets: [
                    {
                      label: 'Problem Stats',
                      data: [
                        user.problemStats?.easy || 0,
                        user.problemStats?.medium || 0,
                        user.problemStats?.hard || 0,
                      ],
                      backgroundColor: ['#2cb255', '#feb600', '#f63737'],
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCode} /> Language Stats
            </h3>
            <div className="w-full h-56 flex flex-col items-center">
              <Pie
                data={{
                  labels: user.languageStats?.map((stat) => stat.languageName) || [],
                  datasets: [
                    {
                      label: 'Problems Solved by Language',
                      data: user.languageStats?.map((stat) => stat.problemsSolved) || [],
                      backgroundColor: ['#6C5DD3', '#00C1D4', '#FFC700', '#FF7F50'],
                    },
                  ],
                }}
              />
            </div>
          </div>

         
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              Problem Counts
            </h3>
            <div className="max-h-52 overflow-y-auto scrollbar-hide">
              {Object.entries(user.tagProblemCounts || {}).map(([level, tags]) => (
                <div key={level} className="mb-4">
                  <h4 className="text-md font-semibold text-gray-700 capitalize mb-2">{level}</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div
                        key={tag.tagName}
                        className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full shadow-md hover:bg-gray-200 transition-colors"
                      >
                        {tag.tagName} ({tag.problemsSolved})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
