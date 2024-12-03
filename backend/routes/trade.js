const express = require('express');
const router = express.Router();

const { offerTrade, getTrades, acceptTrade, rejectTrade } = require('../controllers/tradeController');
const verifyToken = require('../middleware/verifyToken');


// @desc    Offer new trade
router.post('/api/trades', verifyToken, offerTrade);


// @desc    Get all trades
router.get('/api/trades', verifyToken, getTrades);


// @desc    Accept trade
router.put('/api/trades/:id/accept', verifyToken, acceptTrade);

// @desc    Reject trade
router.put('/api/trades/:id/reject', verifyToken, rejectTrade);

module.exports = router;