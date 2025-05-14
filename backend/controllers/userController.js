/**
 * User Controller Module
 * Handles all user-related operations including authentication, profile management,
 * and user data retrieval
 */

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchLeetcodeData from '../utils/leetcodeUserData.js';
import { calculateScore } from '../utils/userScore.js';
import FriendRequest from '../models/FriendRequest.js';


/**
 * User Registration
 * Creates a new user account with LeetCode data integration
 * @param {Object} req - Request object containing user details
 * @param {Object} res - Response object
 */
const signup = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Fetch user data from LeetCode
    const userData = await fetchLeetcodeData(username);
    const score = calculateScore(userData);

    // Create new user with combined data
    const user = new User({
      ...userData,
      score,
      realName: name,
      password: hashedPassword,
      email: email,
    });
    await user.save();

    // Generate JWT token for authentication
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

/**
 * User Authentication
 * Authenticates user and provides access token
 * @param {Object} req - Request object containing credentials
 * @param {Object} res - Response object
 */
const signin = async (req, res) => {
  const { username, password } = req.body;
  console.log(username + " signed in");

  try {
    // Find user and select required fields
    const user = await User.findOne({ username }).select('profileImage realName username score password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Prepare user data for response
    const data = {
      profileImage: user.profileImage,
      realName: user.realName,
      username: user.username,
      score: user.score
    };

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Signed in successfully', token, data });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * User Search Suggestions
 * Provides user suggestions based on search query
 * @param {Object} req - Request object containing search query
 * @param {Object} res - Response object
 */
const getUserSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search users by username or real name
    const suggestions = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { realName: { $regex: query, $options: 'i' } },
      ],
    })
      .select('username realName score profileImage') 
      .limit(10) 
      .sort({ score: -1 }); 

    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get User Data
 * Retrieves detailed user data for the authenticated user
 * @param {Object} req - Request object containing user ID
 * @param {Object} res - Response object
 */
const getUserData = async (req, res) => {
  try {
    const { id } = req.userid;
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }
    
    // Fetch comprehensive user data including problem stats and achievements
    const user = await User.findById(id).select(
      'profileImage realName username country githubUrl linkedinUrl score ' + 
      'problemStats.easy problemStats.medium problemStats.hard ' +
      'languageStats.languageName languageStats.problemsSolved ' +
      'contestRating totalContestsParticipated globalRanking ' +
      'badges.icon badges.displayName ' +
      'pastChallenges.title pastChallenges.status ' +
      'tagProblemCounts.advanced.tagName tagProblemCounts.advanced.problemsSolved ' +
      'tagProblemCounts.intermediate.tagName tagProblemCounts.intermediate.problemsSolved ' +
      'tagProblemCounts.fundamental.tagName tagProblemCounts.fundamental.problemsSolved'
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Successfull', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get User Profile
 * Retrieves public profile data for a specific user
 * Includes friend request status between the authenticated user and profile owner
 * @param {Object} req - Request object containing user ID and target username
 * @param {Object} res - Response object
 */
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.userid;
    if (!id) {
      return res.status(400).json({ message: 'id is required' });
    }
    const { username } = req.query;

    // Fetch public profile data
    const user = await User.findOne({ username: username }).select(
      'profileImage realName username country githubUrl linkedinUrl score ' + 
      'problemStats.easy problemStats.medium problemStats.hard ' +
      'languageStats.languageName languageStats.problemsSolved ' +
      'contestRating totalContestsParticipated globalRanking ' +
      'badges.icon badges.displayName ' +
      'pastChallenges.title pastChallenges.status ' +
      'tagProblemCounts.advanced.tagName tagProblemCounts.advanced.problemsSolved ' +
      'tagProblemCounts.intermediate.tagName tagProblemCounts.intermediate.problemsSolved ' +
      'tagProblemCounts.fundamental.tagName tagProblemCounts.fundamental.problemsSolved'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check friend request status
    const friend = await User.findOne({ username: username }).select('_id');
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    
    let status = 'none';
    const friendRequest = await FriendRequest.findOne({
      $or: [
        { sender: id, receiver: friend._id },
        { sender: friend._id, receiver: id },
      ],
    });

    if (friendRequest) {
      status = friendRequest.status;
    }

    res.status(200).json({ message: 'Successfull', user, status });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { signup, signin, getUserSuggestions, getUserData, getUserProfile };
