const express = require('express');
const router = express.Router();

const { rateTrade, getTradeRating } = require('../controllers/ratingReviewController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Rate & Review trade
router.post('/api/trades/:id/rate', verifyToken, rateTrade);

// @desc    Get Trade Rating & Review
router.get('/api/rating/trade/:id', verifyToken, getTradeRating);

module.exports = router;