import express from "express";
const router = express.Router();
import { sendMessage, getMessages } from "../controllers/messageController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getMessages);
export default router;
