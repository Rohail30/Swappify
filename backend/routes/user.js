const express = require('express');
const router = express.Router();

const { getUser, updateUser, getAllUsers } = require('../controllers/userController');

// @desc    Get User details
router.get('/:userId', getUser);

// @desc    Update User details
router.put('/:userId', updateUser);

// @desc    Get all Users
router.get('/', getAllUsers);


module.exports = router;