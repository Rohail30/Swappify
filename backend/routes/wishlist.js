const express = require('express');
const router = express.Router();

const { addItemToWishlist, removeItemFromWishlist, getWishlist } = require('../controllers/wishlistController');
const verifyToken = require('../middleware/verifyToken');


// @desc    Add item to wishlist
router.post('/api/wishlist', verifyToken, addItemToWishlist);

// @desc    Remove item from wishlist
router.delete('/api/wishlist', verifyToken, removeItemFromWishlist);

// @desc    Get wishlist
router.get('/api/wishlist', verifyToken, getWishlist);

module.exports = router;