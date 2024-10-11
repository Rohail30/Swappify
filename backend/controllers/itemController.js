const Item = require("../models/ItemModel");
const upload = require("../config/multer");


// @desc    Add a new item
// @route   POST /api/items
// @access  Private

const addItem = async (req, res) => {

    upload(req, res, async (err) => {

        const { name, description, owner, condition, category, location, priceMin, priceMax } = req.body;

        if (!name || !description || !owner || !condition || !category || !location || !priceMin || !priceMax) {
            return res.status(400).json({ error: true, message: "Please enter all the required fields" });
        }

        if (priceMin < 0 || priceMax < 0) {
            return res.status(400).json({ error: true, message: "Price cannot be negative" });
        }
        if (err) {
            return res.status(400).json({ error: true, message: err.message });
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
    });
};


module.exports = { addItem };