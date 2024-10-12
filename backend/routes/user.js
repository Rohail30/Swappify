const express = require('express');
const router = express.Router();

const { getUser, updateUser, getAllUsers } = require('../controllers/userController');

// @desc    Get User details
router.get('/api/users/:userId', getUser);

// @desc    Update User details
router.put('/api/users/:userId', updateUser);

// @desc    Get all Users
router.get('/api/users/', getAllUsers);


module.exports = router;