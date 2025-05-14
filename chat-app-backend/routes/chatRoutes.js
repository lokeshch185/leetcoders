import express from 'express';
import {   accessChats,
    fetchAllChats,
    creatGroup,
    renameGroup,
    addToGroup,
    removeFromGroup,
createChat} from '../controllers/chatController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',verifyToken, createChat);
router.post('/', verifyToken, accessChats);
router.get('/', verifyToken, fetchAllChats);
router.post('/group', verifyToken, creatGroup);
router.patch('/group/rename', verifyToken, renameGroup);
router.patch('/groupAdd', verifyToken, addToGroup);
router.patch('/groupRemove', verifyToken, removeFromGroup);
router.delete('/removeuser', verifyToken);

export default router;