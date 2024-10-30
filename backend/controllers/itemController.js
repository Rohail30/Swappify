const Item = require("../models/ItemModel");
const fs = require("fs");
const path = require("path");


// @desc    Add a new item
// @route   POST /api/items
// @access  Private

const addItem = async (req, res) => {

    const { name, description, owner, condition, category, location, priceMin, priceMax } = req.body;

    if (!name || !description || !owner || !condition || !category || !location || !priceMin || !priceMax) {
        return res.status(400).json({ error: true, message: "Please enter all the required fields" });
    }

    if (priceMin < 0 || priceMax < 0) {
        return res.status(400).json({ error: true, message: "Price cannot be negative" });
    }

    if (!req.file) {
        return res.status(400).json({ error: true, message: "Image is required" });
    }

    try {
        const newItem = await Item.create({
            name,
            description,
            owner,
            image: `/images/${req.file.filename}`,
            condition,
            category,
            location,
            price: {
                min: priceMin,
                max: priceMax,
            },
        });

        return res.status(200).json({ error: false, message: "Item added successfully", item: newItem });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};



// @desc    Update an item
// @route   POST /api/items/update/:id
// @access  Private

const updateItem = async (req, res) => {

    const { name, description, owner, condition, category, location, priceMin, priceMax } = req.body;

    if (!name || !description || !owner || !condition || !category || !location || !priceMin || !priceMax) {
        return res.status(400).json({ error: true, message: "Please enter all the required fields" });
    }

    if (priceMin < 0 || priceMax < 0) {
        return res.status(400).json({ error: true, message: "Price cannot be negative" });
    }

    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: true, message: "Item not found" });
        }

        if (req.file) {
            item.image = `/images/${req.file.filename}`;
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, {
            name,
            description,
            owner,
            condition,
            category,
            location,
            price: {
                min: priceMin,
                max: priceMax,
            },
            image: item.image,
        }, { new: true });

        return res.status(200).json({ error: false, message: "Item updated successfully", updatedItem });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};



// @desc    Delete an item
// @route   DELETE /api/items/delete/:id
// @access  Private

const deleteItem = async (req, res) => {

    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: true, message: "Item not found" });
        }

        await Item.findByIdAndDelete(req.params.id);

        fs.unlinkSync(path.join(__dirname, `../public${item.image}`));

        return res.status(200).json({ error: false, message: "Item deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Get all items
// @route   GET /api/items
// @access  Public

const getAllItems = async (req, res) => {

    try {
        const items = await Item.find();

        return res.status(200).json({ error: false, items });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Get a single item
// @route   GET /api/items/:id
// @access  Public

const getItem = async (req, res) => {

    try {
        const item = await Item.findById(req.params.id)

        if (!item) {
            return res.status(404).json({ error: true, message: "Item not found" })
        }

        return res.status(200).json({ error: false, item });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message })
    }
}


// @desc    Get All items by particular user
// @route   GET /api/items/user/:id
// @access  Public

const getItemsByUser = async (req, res) => {

    try {
        const items = await Item.find({ owner: req.params.id });

        return res.status(200).json({ error: false, items });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Search items using query and filters
// @route   GET /api/items/search
// @access  Public

const searchItems = async (req, res) => {

    try {
        const { name, category, location, condition, priceMin, priceMax } = req.query;

        let query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (category) {
            query.category = { $in: category.split(",") };
        }

        if (location) {
            query.location = location;
            // query.location = { $regex: location, $options: "i" };
        }

        if (condition) {
            query.condition = condition;
        }

        if (priceMin || priceMax) {
            query["price.min"] = { $gte: priceMin || 0 };
            query["price.max"] = { $lte: priceMax || Infinity };
        }

        const items = await Item.find(query);

        return res.status(200).json({ error: false, items });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

module.exports = { addItem, updateItem, deleteItem, getAllItems, getItem, getItemsByUser, searchItems };