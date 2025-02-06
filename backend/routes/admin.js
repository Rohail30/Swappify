const express = require('express');
const router = express.Router();

const { login, logout, getAllUsers } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Admin login
router.post('/api/admin/login', login);

// @desc    Admin logout
router.get('/api/admin/logout', logout);

// @desc    Get all users
router.get('/api/admin/users', verifyToken, getAllUsers);

module.exports = router;