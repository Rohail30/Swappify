const express = require('express');
const router = express.Router();

const { addItem } = require('../controllers/itemController');


// @desc    Add a new item
router.post('/add', addItem);


module.exports = router;