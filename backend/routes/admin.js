const express = require('express');
const router = express.Router();

const { login, logout, getAllUsers, getAllItems, banUser, unbanUser, deleteItem } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Admin login
router.post('/api/admin/login', login);

// @desc    Admin logout
router.get('/api/admin/logout', logout);

// @desc    Get all users
router.get('/api/admin/users', getAllUsers);

// @desc    Get all items
router.get('/api/admin/items', getAllItems);

// @desc    Ban a user
router.put('/api/admin/ban/:id', verifyToken, banUser);

// @desc    Unban a user
router.put('/api/admin/unban/:id', verifyToken, unbanUser);

// @desc    Delete an item
router.delete('/api/admin/item/:id', verifyToken, deleteItem);

module.exports = router;