const express = require('express');
const router = express.Router();

const { getUser, updateUser, getAllUsers } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Get User details
router.get('/api/users/:userId', getUser);

// @desc    Update User details
router.put('/api/users/:userId', verifyToken, updateUser);

// @desc    Get all Users
router.get('/api/users/', verifyToken, getAllUsers);


module.exports = router;