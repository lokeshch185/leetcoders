import React,{ useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faClock, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import LoadingBar from "./LoadingBar";

const ActiveChallenges = ({ newChallenge }) => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please sign in again.");
                    return;
                }
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/challenge/getactivechallenge`, {
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
    }, [newChallenge]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    if (loading) {
        return <LoadingBar/>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className=" relative">
            
            <div className=" lg:block absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
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
                {challenges.map((challenge) => (
                    <motion.div
                        key={challenge._id}
                        className="flex-none w-72 bg-white shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-4 flex flex-row items-center space-x-5 justify-around bg-[#cbf6ef] rounded-lg shadow-md">
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src={challenge.challenger.profileImage}
                                    alt={challenge.challenger.realName}
                                    className="w-16 h-16 rounded-full border-2 border-blue-500"
                                />
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{challenge.challenger.realName}</p>
                                    <p className="text-sm text-gray-500">@{challenge.challenger.username}</p>
                                </div>
                            </div>

                            <p className="text-2xl font-bold text-gray-500 mx-4">VS</p>

                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src={challenge.opponent.profileImage}
                                    alt={challenge.opponent.realName}
                                    className="w-16 h-16 rounded-full border-2 border-red-500"
                                />
                                <div className="text-center">
                                    <p className="text-lg font-bold text-gray-800">{challenge.opponent.realName}</p>
                                    <p className="text-sm text-gray-500">@{challenge.opponent.username}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#fafcfb] p-4 text-center">
                            <p className="text-lg font-bold text-blue-600 capitalize">{challenge.criterion}</p>
                            <div className="flex justify-center items-center space-x-2 mt-2 text-gray-600">
                                <FontAwesomeIcon icon={faClock} className="text-blue-500" />
                                <p className="text-sm">{new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 flex justify-center items-center space-x-4 text-gray-800">
                                <div>
                                    <p className="text-sm">Challenger</p>
                                    <p className="text-lg font-bold">+ {challenge.currentValueChallenger - challenge.startValueChallenger}</p>
                                </div>
                                <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-2xl" />
                                <div>
                                    <p className="text-sm">Opponent</p>
                                    <p className="text-lg font-bold">+ {challenge.currentValueOpponent - challenge.startValueOpponent}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActiveChallenges;
