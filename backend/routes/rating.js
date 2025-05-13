const express = require('express');
const router = express.Router();

const { rateTrade, getTradeRating, getUserRatings } = require('../controllers/ratingReviewController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Rate & Review trade
router.post('/api/trades/:id/rate', verifyToken, rateTrade);

// @desc    Get Trade Rating & Review
router.get('/api/rating/trade/:id', verifyToken, getTradeRating);

// @desc    Get all ratings & reviews for a user
router.get('/api/rating/user/:id', getUserRatings);

module.exports = router;