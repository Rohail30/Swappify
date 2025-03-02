const Item = require('../models/ItemModel');
const Wishlist = require('../models/WishllistModel');
const fs = require('fs');
const path = require('path');

// @desc    Add a new item
// @route   POST /api/items
// @access  Private

const addItem = async (req, res) => {
  const { name, description, owner, condition, category, location, priceMin, priceMax } = req.body;

  if (!name || !description || !owner || !condition || !category || !location || !priceMin || !priceMax) {
    return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
  }

  if (Number(priceMin) < 0 || Number(priceMax) < 0) {
    return res.status(400).json({ error: true, message: 'Price cannot be negative' });
  }

  if (Number(priceMin) > Number(priceMax)) {
    return res.status(400).json({ error: true, message: 'Minimum price cannot be greater than maximum price' });
  }

  if (!req.file) {
    return res.status(400).json({ error: true, message: 'Image is required. Only jpeg, jpg & png files are allowed' });
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

    return res.status(200).json({ error: false, message: 'Item added successfully', item: newItem });
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
    return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
  }

  if (Number(priceMin) < 0 || Number(priceMax) < 0) {
    return res.status(400).json({ error: true, message: 'Price cannot be negative' });
  }

  if (Number(priceMin) > Number(priceMax)) {
    return res.status(400).json({ error: true, message: 'Minimum price cannot be greater than maximum price' });
  }

  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: true, message: 'Item not found' });
    }

    if (req.file) {
      item.image = `/images/${req.file.filename}`;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );

    return res.status(200).json({ error: false, message: 'Item updated successfully', updatedItem });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/delete/:id
// @access  Private

const deleteItem = async (req, res) => {
  const id = req.params.id;

  try {
    const item = await Item.findOne({ _id: id, status: 'available' });

    if (!item) {
      return res.status(404).json({ error: true, message: 'Item not found OR Item is already traded' });
    }

    await Item.findByIdAndDelete(id);
    await Trade.deleteMany({ $or: [{ ItemOffered: id }, { ItemWanted: id }] });
    await Wishlist.updateMany(
      { 'items.itemId': id },
      { $pull: { items: { itemId: id } } }
    );

    fs.unlinkSync(path.join(__dirname, `../public${item.image}`));

    return res.status(200).json({ error: false, message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'name');

    return res.status(200).json({ error: false, items });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

// @desc    Get a single item
// @route   GET /api/items/:id
// @access  Public

const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'name');

    if (!item) {
      return res.status(404).json({ error: true, message: 'Item not found' });
    }

    return res.status(200).json({ error: false, item });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

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
};

// @desc    Search items using query and filters
// @route   GET /api/items/search
// @access  Public

const searchItems = async (req, res) => {
  try {
    const { name, category, location, condition, priceMin, priceMax } =
      req.query;

    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (category) {
      query.category = { $in: category.split(',') };
    }

    if (location) {
      query.location = { $in: location.split(',') };
    }

    if (condition) {
      query.condition = { $regex: condition };
    }

    if (priceMin || priceMax) {
      query['$and'] = [
        { 'price.max': { $lte: priceMax || Infinity } },
        { 'price.min': { $gte: priceMin || 0 } },
      ];
    }

    const items = await Item.find(query);

    return res.status(200).json({ error: false, items });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = { addItem, updateItem, deleteItem, getAllItems, getItem, getItemsByUser, searchItems };
