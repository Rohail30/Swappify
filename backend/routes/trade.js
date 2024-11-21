const express = require('express');
const router = express.Router();

const { offerTrade } = require('../controllers/tradeController');
const verifyToken = require('../middleware/verifyToken');


// @desc    Offer new trade
router.post('/api/trades', verifyToken, offerTrade);


module.exports = router;