const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        condition: {
            type: String,
            enum: ["new", "used"],
            required: true,
        },
        category: {
            type: String,
            enum: [
                'electronics', 'furniture', 'clothing & accessories', 'books & media', 'home & garden', 'sports & outdoors', 'toys & games', 'tools & hardware', 'automotive', 'office supplies', 'collectibles & antiques', 'other'
            ],
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            min: {
                type: Number,
                required: true,
                min: 0,
            },
            max: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        status: {
            type: String,
            enum: ["available", "traded"],
            required: true,
            default: "available",
        },
    },
    { timestamps: true }
);


const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
module.exports = Item;