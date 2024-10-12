const express = require('express');
const router = express.Router();

const { addItem, updateItem, deleteItem, getAllItems, getItem, getItemsByUser } = require('../controllers/itemController');
const upload = require('../config/multer');


// @desc    Get all items
router.get('/', getAllItems);


// @desc    Add a new item
router.post('/add', upload, addItem);


// @desc    Update an item
router.put('/update/:id', upload, updateItem);


// @desc    Delete an item
router.delete('/delete/:id', deleteItem);


// @desc    Get a single item
router.get('/:id', getItem);


// @desc    Get All items by particular user
router.get('/user/:id', getItemsByUser);

module.exports = router;