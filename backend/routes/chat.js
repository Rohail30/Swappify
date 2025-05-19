const express = require('express');
const router = express.Router();

const { getChat } = require('../controllers/chatController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Get chat between two users
router.get('/api/chat/:reciever', verifyToken, getChat);

module.exports = router;