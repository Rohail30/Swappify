const Wishlist = require('../models/WishllistModel');
const Item = require('../models/ItemModel');
const User = require('../models/UserModel');


// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private

const addItemToWishlist = async (req, res) => {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ error: true, message: 'User ID and Item ID are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ error: true, message: 'Item not found' });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        const isItemInWishlist = await Wishlist.findOne({ userId, 'items.itemId': itemId });

        if (isItemInWishlist) {
            return res.status(400).json({ error: true, message: 'Item already in wishlist' });
        }

        wishlist.items.push({ itemId });
        await wishlist.save();

        return res.status(201).json({ error: false, message: 'Item added to wishlist' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist
// @access  Private

const removeItemFromWishlist = async (req, res) => {
    const userId = req.userId;
    const itemId = req.params.itemId;

    if (!userId || !itemId) {
        return res.status(400).json({ error: true, message: 'User ID and Item ID are required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ error: true, message: 'Item not found' });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({ error: true, message: 'Wishlist not found' });
        }

        const isItemInWishlist = await Wishlist.findOne({ userId, 'items.itemId': itemId });

        if (!isItemInWishlist) {
            return res.status(400).json({ error: true, message: 'Item not in wishlist' });
        }

        await Wishlist.updateOne({ userId }, { $pull: { items: { itemId } } });

        return res.status(200).json({ error: false, message: 'Item removed from wishlist' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


//@desc    Get user's wishlist
//@route   GET /api/wishlist
//@access  Private

const getWishlist = async (req, res) => {
    const userId = req.userId;

    try {
        const wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }

        return res.status(200).json({ error: false, wishlist });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }

}


module.exports = { addItemToWishlist, removeItemFromWishlist, getWishlist };