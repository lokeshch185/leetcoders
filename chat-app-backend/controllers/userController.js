/**
 * User Controller
 * Handles user-related operations including friend management
 */

import User from '../models/User.js';

/**
 * Get all friends of the current user
 * @param {Object} req - Request object containing user ID in userid
 * @param {Object} res - Response object
 */
const getFriends = async (req, res) => {
    const userId = req.userid.id;
    
    try {
        const user = await User.findById(userId)
            .populate('friends', 'username realName profileImage');
  
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
  
        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Failed to fetch friends' });
    }
};

export { getFriends };