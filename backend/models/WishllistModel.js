const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        items: [{
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Item'
            },
            dateAdded: {
                type: Date,
                default: Date.now
            }
        }]
    }, { timestamps: true });


const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;