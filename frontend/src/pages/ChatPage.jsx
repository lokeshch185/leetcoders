import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

let socket;

const FriendsChat = () => {
    const [friends, setFriends] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFriends, setIsLoadingFriends] = useState(true);
    const [error, setError] = useState(null);
    const [friendsError, setFriendsError] = useState(null);
    const userData = JSON.parse(localStorage.getItem('userData')) || JSON.parse(sessionStorage.getItem('userData'));
    const currentUserName = userData.realName;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const messagesEndRef = useRef(null);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const fetchChats = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_APP_CHAT_URL}/api/chats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching chats:", error);
            setError("Failed to load chats");
            setChats([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setIsLoadingFriends(true);
                setFriendsError(null);
                const response = await axios.get(`${import.meta.env.VITE_APP_CHAT_URL}/api/user/friends`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFriends(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching friends:", error);
                setFriendsError("Failed to load friends");
                setFriends([]);
            } finally {
                setIsLoadingFriends(false);
            }
        };
        fetchFriends();
    }, []);

    useEffect(() => {
        socket = io(import.meta.env.VITE_APP_CHAT_URL);
        socket.emit('setup', userData.username);

        socket.on('connected', () => console.log('Socket connected'));
        socket.on('message received', (newMessageReceived) => {
            console.log('New message received:', newMessageReceived.chatId._id, newMessageReceived.message);

            if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
                setChats((prevChats) => {
                    const updatedChats = prevChats.map((chat) =>
                        chat._id === newMessageReceived.chatId._id
                            ? { ...chat, lastMessage: newMessageReceived.message, hasNewMessage: true }
                            : chat
                    );

                    const chatToMove = updatedChats.find(
                        (chat) => chat._id === newMessageReceived.chatId._id
                    );
                    if (chatToMove) {
                        return [chatToMove, ...updatedChats.filter((chat) => chat._id !== chatToMove._id)];
                    }
                    return updatedChats;
                });

                return;
            }

            setMessages((prev) => [...prev, newMessageReceived]);
        });

        return () => socket.disconnect();
    }, [selectedChat]);

    const handleSelectChat = async (chat) => {
        setSelectedChat(chat);

        setChats((prevChats) =>
            prevChats.map((c) =>
                c._id === chat._id ? { ...c, hasNewMessage: false } : c
            )
        );

        try {
            const response = await axios.get(
                    `${import.meta.env.VITE_APP_CHAT_URL}/api/message/${chat._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data);

            socket.emit('join room', chat._id);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };


    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_CHAT_URL}/api/message`,
                {
                    chatId: selectedChat._id,
                    message: newMessage,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessages((prev) => [...prev, response.data]);
            setNewMessage("");

            socket.emit("new message", response.data);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            setSearchResults([]);
            return;
        }
        if (Array.isArray(friends)) {
            const results = friends.filter(friend =>
                friend.realName.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_CHAT_URL}/api/chats`,
                { userId: friendId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChats((prev) => [response.data, ...prev]);
            setSearchResults([]);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };



    return (
        <div className="flex h-[90vh]">
            <motion.div
                className="w-1/4 border-r-2 border-t-2 bg-[#ffffff] text-white overflow-y-auto"
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4 text-[#3095de]">Chats</h2>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search friends..."
                        className="w-full p-2 bg-gray-200 my-2 text-black rounded-md"
                    />
                    {isLoadingFriends ? (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                    ) : friendsError ? (
                        <div className="text-red-500 p-4 text-center">{friendsError}</div>
                    ) : searchResults.length > 0 ? (
                        <div className="mt-1 bg-white border-2 max-h-60 overflow-y-auto py-3 rounded-sm">
                            {searchResults.map((friend) => {
                                const existingChat = chats.find((chat) =>
                                    chat.users.some((user) => user._id === friend._id)
                                );

                                return (
                                    <div
                                        key={friend._id}
                                        className="flex items-center p-3 cursor-pointer hover:bg-gray-300"
                                        onClick={() => {
                                            if (existingChat) {
                                                handleSelectChat(existingChat);
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }
                                        }}
                                    >
                                        <img
                                            src={friend.profileImage}
                                            alt={friend.realName}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold text-gray-800">{friend.realName}</p>
                                        </div>
                                        {!existingChat && (
                                            <button
                                                className="ml-3 text-blue-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddFriend(friend._id);
                                                }}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : searchQuery && !isLoadingFriends && !friendsError ? (
                        <div className="text-gray-500 p-4 text-center">No friends found</div>
                    ) : null}

                    {isLoading ? (
                        <div className="flex justify-center items-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 p-4 text-center">{error}</div>
                    ) : chats.length === 0 ? (
                        <div className="text-gray-500 p-4 text-center">No chats yet</div>
                    ) : (
                        chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => handleSelectChat(chat)}
                                className={`relative flex items-center p-2 mt-2 cursor-pointer border-b-2 ${
                                    selectedChat && selectedChat._id === chat._id
                                        ? "bg-gray-300"
                                        : "hover:bg-gray-200"
                                }`}
                            >
                                <img
                                    src={chat.users[1].realName === currentUserName ? chat.users[0].profileImage : chat.users[1].profileImage}
                                    alt={chat.users[1].realName === currentUserName ? chat.users[0].realName : chat.users[1].realName}
                                    className="w-10 h-10 rounded-full"
                                />

                                <div className="ml-3">
                                    <p className="font-semibold text-gray-800">
                                        {chat.users[1].realName === currentUserName ? chat.users[0].realName : chat.users[1].realName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {chat.hasNewMessage ? chat.lastMessage : chat.latestMessage?.message || "No messages yet"}
                                    </p>
                                </div>
                                {chat.hasNewMessage && (
                                    <div className="absolute top-1/2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </motion.div>

            <motion.div
                className="flex-1 flex flex-col bg-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b-2 bg-[#f4f4f6] flex flex-row items-center space-x-4">
                            <img
                                src={selectedChat.users[1].realName === currentUserName ? selectedChat.users[0].profileImage : selectedChat.users[1].profileImage}
                                alt={selectedChat.users[1].realName === currentUserName ? selectedChat.users[0].realName : selectedChat.users[1].realName}
                                className="w-10 h-10 rounded-full"
                            />
                            <h2 className="text-xl font-bold  text-gray-900">{selectedChat.users[1].realName === currentUserName ? selectedChat.users[0].realName : selectedChat.users[1].realName}</h2>
                        
                        </div>
                        <div className="flex-1 bg-[rgb(251,251,251)] p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-300">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    className={`mb-3 ${msg.sender.realName === currentUserName ? "text-right" : "text-left"}`}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className={`inline-block px-4 py-2 rounded-lg ${msg.sender.realName === currentUserName
                                            ? "bg-[#005c4b] text-white"
                                            : "bg-blue-500 text-white"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </motion.div>

                            ))}
                            <div ref={messagesEndRef}></div>
                        </div>
                        <div className=" bg-white w-full  flex justify-center items-center">
                            <input
                                type="text"
                                className="p-3 mb-8 border border-gray-400 focus:border-gray-500 shadow-md w-1/2 bg-white rounded-lg focus:outline-none focus:ring-3 focus:ring-gray-400 transition-all duration-200 ease-in-out"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Type a message..."
                            />
                                                    </div>
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center">
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FriendsChat;
