const express = require('express');
const router = express.Router();

const { getUser, updateUser } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Get User details
router.get('/api/users/:userId', getUser);

// @desc    Update User details
router.put('/api/users/:userId', verifyToken, updateUser);


module.exports = router;