# LeetCoders Backend

The backend service for LeetCoders platform, handling user authentication, data management, and core API functionality.

## 🏗️ Architecture

The backend is built using Node.js and Express.js, following a modular architecture with separate controllers, routes, and models.

```
backend/
├── controllers/    # Request handlers
│   ├── userController.js           # User authentication and profile management
│   ├── challengeController.js      # Manage coding challenges
│   ├── DCCController.js            # Daily coding challenge operations
│   ├── friendRequestController.js  # Handle friend requests
│   ├── leaderboardController.js    # Manage leaderboard data
│   └── StriverSheetController.js   # Striver DSA sheet tracking
├── models/         # Database models
│   ├── User.js                    # User schema and model
│   ├── Challenge.js               # Challenge schema and model
│   ├── DailyCodingChallenge.js    # DCC schema and model
│   ├── FriendRequest.js           # Friend request schema and model
│   ├── StriverSheet.js            # Striver sheet schema and model
│   └── dbConnection.js            # Database connection utility
├── routes/         # API routes
│   ├── userRoutes.js              # User-related endpoints
│   ├── challengeRoutes.js         # Challenge endpoints
│   ├── DCCRoutes.js               # Daily challenge endpoints
│   ├── friendRequestRoutes.js     # Friend request endpoints
│   ├── leaderboardRoutes.js       # Leaderboard endpoints
│   └── StriverSheetRoutes.js      # Striver sheet endpoints
├── scripts/        # Scheduled jobs
│   ├── DCCTracker.js              # Daily challenge tracking automation
│   ├── updateLeaderBoard.js       # Scheduled leaderboard updates
│   └── challengeResultScheduler.js # Challenge results processing
├── middleware/     # Custom middleware
│   └── authmiddleware.js          # Authentication middleware
├── utils/          # Utility functions
│   ├── sendMail.js                # Email notification service
│   ├── userScore.js               # User scoring calculations
│   ├── leetcodeUserData.js        # LeetCode API integration
│   ├── getDCCQuestion.js          # Fetch daily coding challenges
│   └── getRecentSubmissions.js    # Fetch user submissions
├── index.js        # Main server file
```

## 🚀 Features

- **User Management**
  - Registration and authentication
  - Profile management
  - Password reset functionality
  - User statistics tracking

- **Challenge System**
  - Daily coding challenge tracking
  - Friend challenges
  - Challenge history and results
  - Automated challenge verification
  
- **Progress Tracking**
  - Striver DSA sheet progress
  - User achievements
  - Submission history
  
- **Social Features**
  - Friend request system
  - Friend list management
  
- **Leaderboard**
  - Global ranking system
  - Automated leaderboard updates

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn


## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting protection
- CORS configuration
- Helmet for security headers
- Request size limiting

## 🔄 API Endpoints

- `/api/user` - User management
- `/api/leaderboard` - Leaderboard operations
- `/api/challenge` - Challenge management
- `/api/dcc` - Daily coding challenge
- `/api/striversheet` - Striver sheet tracking
- `/api/friend-requests` - Friend request handling

## 📊 Automated Processes

The backend includes several scheduled tasks:
- Daily challenge initialization and tracking
- Leaderboard updates
- Challenge results processing
- User statistics updates

## 🤝 Contributing

Please read our [Contributing Guidelines](../../CONTRIBUTING.md) before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details. 