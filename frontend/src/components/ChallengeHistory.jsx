import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faHandshake, faFlag, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LoadingBar from "./LoadingBar";

const ChallengeHistory = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || JSON.parse(sessionStorage.getItem("userData"));

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setError("No token found. Please sign in again.");
          return;
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenge/getcompletedchallenge`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChallenges(response.data.challenges);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch challenges.");
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <LoadingBar/>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="relative">

      <div className="lg:block absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="text-3xl text-gray-900 cursor-pointer hover:text-blue-600"
          onClick={scrollLeft}
        />
      </div>
      <div className=" lg:block absolute right-2 top-1/2 transform -translate-y-1/2 z-10 ">
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-3xl text-gray-900 cursor-pointer hover:text-blue-600"
          onClick={scrollRight}
        />
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 p-4 ms-9  scrollbar-hide lg:scroll-smooth"
      >
        {challenges.map((challenge, index) => (
          <motion.div
            key={challenge._id}
            className="flex-none w-72 bg-white shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="p-4 flex flex-row items-center space-x-5 justify-around bg-[#cbf6ef] rounded-lg shadow-md">

              <div className="flex flex-col items-center space-y-2">
                <img
                  src={challenge.challenger.profileImage}
                  alt={challenge.challenger.realName}
                  className="w-16 h-16 rounded-full border-2 border-blue-500"
                />
                <p className="text-lg font-bold text-gray-800">{challenge.challenger.realName}</p>
                <p className="text-sm text-gray-500">@{challenge.challenger.username}</p>
                <p className="text-sm text-green-600">
                  +{challenge.endValueChallenger - challenge.startValueChallenger}
                </p>
              </div>

              <p
                className={`text-2xl font-bold mx-4 ${challenge.result === "challenger" && challenge.challenger.username === userData.username
                    ? "text-green-500"
                    : challenge.result === "tie"
                      ? "text-gray-500"
                      : "text-red-500"
                  }`}
              >
                VS
              </p>

              <div className="flex flex-col items-center space-y-2">
                <img
                  src={challenge.opponent.profileImage}
                  alt={challenge.opponent.realName}
                  className="w-16 h-16 rounded-full border-2 border-red-500 text-center"
                />
                <p className="text-lg font-bold text-center text-gray-800">{challenge.opponent.realName}</p>
                <p className="textsm text-gray-500">@{challenge.opponent.username}</p>
                <p className="text-sm text-green-600">
                  +{challenge.endValueOpponent - challenge.startValueOpponent}
                </p>
              </div>
            </div>

            <div className="p-4 text-center bg-[#fafcfb]">
              <p className="text-lg font-bold text-blue-600 capitalize">{challenge.criterion}</p>
              <div className="mt-2">
                <FontAwesomeIcon
                  icon={
                    challenge.result === "challenger"
                      ? faTrophy
                      : challenge.result === "opponent"
                        ? faFlag
                        : faHandshake
                  }
                  className={`text-xl ${challenge.result === "challenger"
                      ? "text-green-500"
                      : challenge.result === "opponent"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                />
                <p
                  className={`text-lg font-bold ${challenge.result === "challenger"
                      ? "text-green-500"
                      : challenge.result === "opponent"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                >
                  {challenge.result === "challenger"
                    ? "You Won!"
                    : challenge.result === "opponent"
                      ? "You Lost!"
                      : "It's a Tie!"}
                </p>
                <p className="text-xs text-gray-500">Ended: {new Date(challenge.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="lg:block absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-3xl text-gray-900 cursor-pointer hover:text-blue-600"
          onClick={scrollRight}
        />
      </div>
    </div>
  );
};

export default ChallengeHistory;
