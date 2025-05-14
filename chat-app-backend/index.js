/**
 * Main server file for the chat application backend
 * Handles Express server setup, WebSocket connections, and API routes
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './models/dbConnection.js';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// Connect to MongoDB
connectDB();

// Middleware configuration
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.set('trust proxy', true);

// API Routes
app.use('/api/chats', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/message', messageRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send("I'm live!!");
});

// Make io instance available throughout the app
app.set('io', io);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user setup and room joining
  socket.on('setup', (username) => {
    socket.join(username);
    socket.emit('connected');
  });

  socket.on('join room', (chatId) => {
    socket.join(chatId);
  });

  // Handle new messages
  socket.on('new message', (messageObj) => {
    const chat = messageObj.chatId;
    if (!chat || !chat._id) {
      console.error('Chat ID is missing');
      return;
    }
    const senderId = messageObj.sender._id;
    const receiverUserName = messageObj.chatId.users.find((user) => user._id !== senderId).username;
    socket.to(receiverUserName).emit("message received", messageObj);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Start server
const port = process.env.PORT || 5001;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
