/**
 * Message Controller
 * Handles all message-related operations including sending and retrieving messages
 */

import Message from '../models/messageModel.js';
import Chat from '../models/chatModel.js';

/**
 * Send a new message in a chat
 * @param {Object} req - Request object containing chatId and message
 * @param {Object} res - Response object
 */
export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;
  // console.log("Request Body:", req.body);

  try {
    // Verify chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create new message
    let msg = await Message.create({
      sender: req.userid.id,
      message: message,
      chatId: chat._id,
    });

    // Populate message with sender and chat details
    msg = await (
      await msg.populate('sender', 'realName profileImage')
    ).populate({
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        path: 'users',
        select: 'realName username profileImage',
        model: 'User',
      },
    });

    // Update chat's latest message
    await Chat.findByIdAndUpdate(chat._id, {
      latestMessage: msg,
    });

    // Emit the new message to the chat users
//     const io = req.app.get('io');
// if (io) {
//   io.to(chat._id).emit('message received', msg); // Emit to the room
// }

    res.status(200).json(msg);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all messages for a specific chat
 * @param {Object} req - Request object containing chatId in params
 * @param {Object} res - Response object
 */
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  // console.log("Chat ID:", chatId);

  try {
    const messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'realName profileImage',
      })
      .populate('chatId');
      
      // console.log("Messages:", messages);

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};
