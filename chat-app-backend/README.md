# Chat App Backend

A real-time chat application backend built with Node.js, Express, and Socket.IO. This backend provides the necessary APIs and WebSocket functionality for the LeetCoders platform chat system.

## 🏗️ Architecture

The chat backend is built using a modular architecture with Express, Socket.IO, and MongoDB.

```
chat-app-backend/
├── controllers/         # Request handlers
│   ├── userController.js      # User authentication and management
│   ├── chatController.js      # Chat room operations
│   └── messageController.js   # Message handling
├── models/              # Database models
│   ├── User.js               # User schema and model
│   ├── chatModel.js          # Chat room schema
│   ├── messageModel.js       # Message schema
│   ├── FriendRequest.js      # Friend request schema
│   └── dbConnection.js       # Database connection utility
├── routes/              # API routes
│   ├── userRoutes.js         # User endpoints
│   ├── chatRoutes.js         # Chat endpoints
│   ├── messageRoutes.js      # Message endpoints
│   └── friendRoutes.js       # Friend request endpoints
├── middleware/          # Custom middleware
│   └── authMiddleware.js     # Authentication middleware
├── index.js             # Main server file with Socket.IO setup
```

## 🚀 Features

- **Real-time Messaging**
  - Instant message delivery using Socket.IO
  - One-on-one chat functionality
  - Group chat support
  - Read receipts and typing indicators

- **Chat Management**
  - Create new chats
  - Create and manage group chats
  - Add/remove users from groups
  - Rename group conversations

- **User Management**
  - User authentication integration with main backend
  - Friend connections
  - Online status tracking

- **Message Features**
  - Message history persistence
  - Real-time notifications
  - Unread message counts

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - Database
- **JWT** - Authentication mechanism

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🔧 Environment Variables

Create a `.env` file in the root directory with:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
```

## 🚀 Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
node index.js
```

## 🔄 API Endpoints

### User Management
- `POST /api/user/login` - Authenticate user

### Chat Management
- `POST /api/chats` - Create a new chat
- `GET /api/chats` - Get all chats for current user
- `POST /api/chats/group` - Create a group chat
- `PUT /api/chats/rename` - Rename a group chat
- `PUT /api/chats/groupadd` - Add user to group
- `PUT /api/chats/groupremove` - Remove user from group

### Messages
- `POST /api/message` - Send a message
- `GET /api/message/:chatId` - Get all messages for a chat

## 📱 WebSocket Events

### Client to Server
- `setup` - Initialize user connection
- `join room` - Join a specific chat room
- `new message` - Send a new message

### Server to Client
- `connected` - Connection established
- `message received` - New message received

## 🔐 Security

- JWT-based authentication
- User validation
- CORS implementation
- Request size limiting

## 🤝 Contributing

Please read the project's [Contributing Guidelines](../../CONTRIBUTING.md) before submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
