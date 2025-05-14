/**
 * Friend Request Model Module
 * Defines the schema for friend requests between users
 */

import mongoose from 'mongoose';

/**
 * Friend Request Schema
 * Tracks friend requests between users with their status
 * @property {ObjectId} sender - Reference to the user who sent the request
 * @property {ObjectId} receiver - Reference to the user who received the request
 * @property {String} status - Current status of the request (pending/accepted/rejected)
 * @property {Date} createdAt - Timestamp when the request was created
 */
const FriendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;