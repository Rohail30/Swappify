const express = require('express');
const router = express.Router();

const { addItem, updateItem, deleteItem, getAllItems, getItem, getItemsByUser, searchItems } = require('../controllers/itemController');
const upload = require('../config/multer');
const verifyToken = require('../middleware/verifyToken');

// @desc    Search items using query and filters
router.get('/api/items/search', searchItems);

// @desc    Get all items
router.get('/api/items/', getAllItems);

// @desc    Add a new item
router.post('/api/items/add', verifyToken, upload, addItem);

// @desc    Update an item
router.put('/api/items/update/:id', verifyToken, upload, updateItem);

// @desc    Delete an item
router.delete('/api/items/delete/:id', verifyToken, deleteItem);

// @desc    Get a single item
router.get('/api/items/:id', getItem);

// @desc    Get All items by particular user
router.get('/api/items/user/:id', getItemsByUser);

module.exports = router;
