const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        items: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Item'
        }]
    }, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);