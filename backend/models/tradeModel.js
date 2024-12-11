const mongoose = require("mongoose");

const TradeSchema = new mongoose.Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ItemOffered: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        ItemWanted: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled"],
            required: true,
            default: "pending",
        },
    }, { timestamps: true }
);

module.exports = mongoose.model("Trade", TradeSchema);