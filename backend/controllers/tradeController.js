const Trade = require("../models/tradeModel");
const Item = require('../models/ItemModel');
const User = require('../models/UserModel');


// @desc    Offer new trade
// @route   POST /api/trades
// @access  Private

const offerTrade = async (req, res) => {
    const { fromUser, toUser, ItemOffered, ItemWanted } = req.body;

    if (!fromUser || !toUser || !ItemOffered || !ItemWanted) {
        return res.status(400).json({ error: true, message: "Please enter all the required fields" });
    }

    const usersExist = await User.find({ _id: { $in: [fromUser, toUser] } });
    if (usersExist.length !== 2) {
        return res.status(400).json({ error: true, message: "One or more users do not exist" });
    }

    const itemsExist = await Item.find({ _id: { $in: [ItemOffered, ItemWanted] } });
    if (itemsExist.length !== 2) {
        return res.status(400).json({ error: true, message: "One or more items do not exist" });
    }

    const tradeExists = await Trade.find({ fromUser, toUser, ItemOffered, ItemWanted, status: "pending" });
    if (tradeExists.length > 0) {
        return res.status(400).json({ error: true, message: "Trade already exists" });
    }

    try {
        const newTrade = await Trade.create({
            fromUser,
            toUser,
            ItemOffered,
            ItemWanted,
        });

        return res.status(200).json({ error: false, message: "Trade offered successfully", trade: newTrade });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

module.exports = { offerTrade };