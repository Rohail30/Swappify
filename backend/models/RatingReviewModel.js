const mongoose = require("mongoose");


const RatingReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ratedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tradeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trade",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


const RatingReview = mongoose.models.RatingReview || mongoose.model("RatingReview", RatingReviewSchema);
module.exports = RatingReview;