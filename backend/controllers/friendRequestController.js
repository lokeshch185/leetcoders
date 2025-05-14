/**
 * Friend Request Controller Module
 * Handles all friend-related operations including sending, accepting, rejecting friend requests,
 * and managing friend relationships
 */

import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js'; 

/**
 * Send Friend Request
 * Creates a new friend request from the authenticated user to another user
 * @param {Object} req - Request object containing receiver ID
 * @param {Object} res - Response object
 */
const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.userid.id; 

  try {
    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    // Create and save new friend request
    const friendRequest = new FriendRequest({ sender: senderId, receiver: receiverId });
    await friendRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Failed to send friend request.' });
  }
};

/**
 * Get Friend Requests
 * Retrieves all pending friend requests for the authenticated user
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
const getFriendRequests = async (req, res) => {
  const userId = req.userid.id;

  try {
    // Find all pending requests and populate sender details
    const requests = await FriendRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'username realName profileImage');
    
    // Format request data for response
    const requestsData = requests.map(request => ({
      id: request._id,
      realName: request.sender.realName,
      username: request.sender.username,
      profileImage: request.sender.profileImage
    }));
    res.status(200).json(requestsData);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Failed to fetch friend requests.' });
  }
};

/**
 * Accept Friend Request
 * Accepts a friend request and updates both users' friend lists
 * @param {Object} req - Request object containing request ID
 * @param {Object} res - Response object
 */
const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // Find the friend request
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    // Update both users' friend lists
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } });

    // Update request status
    await FriendRequest.findByIdAndUpdate(requestId, { status: 'accepted' });

    res.status(200).json({ message: 'Friend request accepted.' });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Failed to accept friend request.' });
  }
};

/**
 * Reject Friend Request
 * Rejects a friend request
 * @param {Object} req - Request object containing request ID
 * @param {Object} res - Response object
 */
const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    // Update request status to rejected
    const request = await FriendRequest.findByIdAndUpdate(
      requestId, 
      { status: 'rejected' }, 
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }
    res.status(200).json({ message: 'Friend request rejected.', request });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Failed to reject friend request.' });
  }
};

/**
 * Remove Friend
 * Removes a friend relationship between two users
 * @param {Object} req - Request object containing friend ID
 * @param {Object} res - Response object
 */
const removeFriend = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.userid.id;

  try {
    // Remove friend from both users' friend lists
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: 'Friend removed successfully.' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Failed to remove friend.' });
  }
};

/**
 * Get Friends
 * Retrieves all friends of the authenticated user
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
const getFriends = async (req, res) => {
  const userId = req.userid.id;

  try {
    // Find user and populate friend details
    const user = await User.findById(userId)
      .populate('friends', 'username realName profileImage score');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Failed to fetch friends.' });
  }
};

export { 
  sendFriendRequest, 
  getFriendRequests, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriend, 
  getFriends
};