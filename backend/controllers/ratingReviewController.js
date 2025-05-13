const Trade = require("../models/tradeModel");
const RatingReview = require("../models/RatingReviewModel");

// @desc    Rate & Review trade
// @route   POST /api/trades/:id/rate
// @access  Private

const rateTrade = async (req, res) => {
    const userId = req.userId;
    const tradeId = req.params.id;
    const { rating, review } = req.body;

    if (!tradeId || !rating || !review) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    try {
        const trade = await Trade.findById(tradeId);

        if (!trade) {
            return res.status(404).json({ error: true, message: "Trade not found" });
        }

        if (trade.status !== "accepted") {
            return res.status(400).json({ error: true, message: "Trade is not accepted" });
        }

        if (trade.toUser.toString() !== userId) {
            return res.status(401).json({ error: true, message: "Not authorized to rate this trade" });
        }

        const existingRating = await RatingReview.findOne({ tradeId, user: userId });

        if (existingRating) {
            return res.status(400).json({ error: true, message: "Rating & Review already exists" });
        }

        await RatingReview.create({ tradeId, user: userId, ratedUser: trade.fromUser, rating, review });

        return res.status(200).json({ error: false, message: "Trade rated successfully" });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Rate & Review for a Trade
// @route   GET /api/rating/trade/:id
// @access  Private
const getTradeRating = async (req, res) => {
    const tradeId = req.params.id;

    if (!tradeId) {
        return res.status(400).json({ error: true, message: "Trade ID is required" });
    }

    try {
        const ratingReview = await RatingReview.findOne({ tradeId })
            .populate("user", "name")
            .populate("ratedUser", "name");

        if (!ratingReview) {
            return res.status(404).json({ error: true, message: "Rating & Review not found" });
        }

        return res.status(200).json({ error: false, ratingReview });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Get all ratings & reviews for a user
// @route   GET /api/rating/user/:id
// @access  Private
const getUserRatings = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ error: true, message: "User ID is required" });
    }

    try {
        const ratings = await RatingReview.find({ ratedUser: userId })
            .populate("user", "name")
            .populate("ratedUser", "name");

        if (!ratings) {
            return res.status(400).json({ error: true, message: "No ratings found" });
        }

        return res.status(200).json({ error: false, ratings });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


module.exports = { rateTrade, getTradeRating, getUserRatings };