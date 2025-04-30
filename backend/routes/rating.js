const express = require('express');
const router = express.Router();

const { rateTrade } = require('../controllers/ratingReviewController');
const verifyToken = require('../middleware/verifyToken');

// @desc    Rate & Review trade
router.post('/api/trades/:id/rate', verifyToken, rateTrade);

module.exports = router;