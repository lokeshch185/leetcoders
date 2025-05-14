/**
 * Chat Controller
 * Handles all chat-related operations including individual and group chats
 */

import Chat from "../models/chatModel.js";
import User from "../models/User.js";

/**
 * Create a new individual chat between two users
 * @param {Object} req - Request object containing userId
 * @param {Object} res - Response object
 */
export const createChat = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.userid.id;

  try {
    const newChat = await Chat.create({
      users: [currentUserId, userId],
      isGroup: false,
    });
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Access or create a chat between two users
 * @param {Object} req - Request object containing userId
 * @param {Object} res - Response object
 */
export const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Provide User's Id" });
  }

  try {
    // Check if chat already exists
    let chatExists = await Chat.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: userId } } },
        { users: { $elemMatch: { $eq: req.userid } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    chatExists = await User.populate(chatExists, {
      path: 'latestMessage.sender',
      select: 'realName email profileImage',
    });

    if (chatExists.length > 0) {
      return res.status(200).send(chatExists[0]);
    }

    // Create new chat if it doesn't exist
    const newChat = await Chat.create({
      chatName: 'sender',
      users: [userId, req.userid],
      isGroup: false,
    });

    const chat = await Chat.find({ _id: newChat._id })
      .populate('users', '-password');
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Fetch all chats for the current user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const fetchAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.userid.id } },
    })
      .populate('users', 'realName profileImage')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    const finalChats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: 'realName profileImage',
    });

    res.status(200).json(finalChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new group chat
 * @param {Object} req - Request object containing chatName and users
 * @param {Object} res - Response object
 */
export const creatGroup = async (req, res) => {
  const { chatName, users } = req.body;

  if (!chatName || !users) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const parsedUsers = JSON.parse(users);
  if (parsedUsers.length < 2) {
    return res.status(400).json({ message: 'Group should contain more than 2 users' });
  }

  try {
    parsedUsers.push(req.rootUser);
    const chat = await Chat.create({
      chatName: chatName,
      users: parsedUsers,
      isGroup: true,
      groupAdmin: req.userid,
    });

    const createdChat = await Chat.findOne({ _id: chat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(createdChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Rename a group chat
 * @param {Object} req - Request object containing chatId and chatName
 * @param {Object} res - Response object
 */
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({ message: 'Provide Chat id and Chat name' });
  }

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: { chatName } },
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add a user to a group chat
 * @param {Object} req - Request object containing userId and chatId
 * @param {Object} res - Response object
 */
export const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const existing = await Chat.findOne({ _id: chatId });
    if (!existing) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (existing.users.includes(userId)) {
      return res.status(409).json({ message: 'User already in group' });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate('groupAdmin', '-password')
      .populate('users', '-password');

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove a user from a group chat
 * @param {Object} req - Request object containing userId and chatId
 * @param {Object} res - Response object
 */
export const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;

  try {
    const existing = await Chat.findOne({ _id: chatId });
    if (!existing) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!existing.users.includes(userId)) {
      return res.status(409).json({ message: 'User not in group' });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate('groupAdmin', '-password')
      .populate('users', '-password');

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeContact = async (req, res) => {};
