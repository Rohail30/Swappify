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
        ItemWanted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        }],
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled"],
            required: true,
            default: "pending",
        },
        isCounterTrade: {
            type: Boolean,
            default: false,
        }
    }, { timestamps: true }
);


const Trade = mongoose.models.Trade || mongoose.model("Trade", TradeSchema);
module.exports = Trade;