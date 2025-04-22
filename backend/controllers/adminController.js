const User = require('../models/UserModel');
const Item = require('../models/ItemModel');
const Wishlist = require('../models/WishllistModel');
const Trade = require("../models/tradeModel");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const sendMail = require('../config/nodemailer');

// @desc    Login an Admin
// @route   POST /api/admin/login
// @access  Public

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: 'Please enter a valid email' });
    }

    try {
        const user = await User.findOne({ email, isAdmin: true });

        if (!user) {
            return res.status(400).json({ error: true, message: 'Admin not found with this email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        const age = 1 * 24 * 60 * 60 * 1000; // 1 day

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: age });

        return res.cookie("token", token, { httpOnly: true, maxAge: age }).status(200).json({ error: false, message: 'Admin logged in successfully', user });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


//@desc     Logout Admin
//@route    GET /api/admin/logout
//@access   Private

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ error: false, message: 'Admin logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });

        return res.status(200).json({ error: false, users });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

//@desc     Get all items
//@route    GET /api/admin/items
//@access   Private

const getAllItems = async (req, res) => {
    try {
        if (req.isAdmin == false) {
            return res.status(403).json({ error: true, message: 'Not authorized as an admin' });
        }
        const items = await Item.find();

        return res.status(200).json({ error: false, items });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};


//@desc     Ban a user
//@route    PUT /api/admin/ban/:id
//@access   Private

const banUser = async (req, res) => {
    const { id } = req.params;

    try {

        if (req.isAdmin == false) {
            return res.status(403).json({ error: true, message: 'Not authorized as an admin' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ error: true, message: 'User not found' });
        }

        user.isBan = true;
        await user.save();

        const items = await Item.find({ owner: id, status: 'available' });
        const itemIds = items.map(item => item._id);

        await Item.deleteMany({ _id: { $in: itemIds } });

        await Trade.deleteMany({
            $or: [
                { ItemOffered: { $in: itemIds } },
                { ItemWanted: { $in: itemIds } }
            ]
        });

        await Wishlist.updateMany(
            { 'items.itemId': { $in: itemIds } },
            { $pull: { items: { itemId: { $in: itemIds } } } }
        );

        await Wishlist.deleteOne({ userId: id });

        for (const i of items) {
            fs.unlinkSync(path.join(__dirname, `../public${i.image}`));
        }

        const data = {
            email: user.email,
            action: 'Banned',
        };

        sendMail('adminAccountAction', data);

        return res.status(200).json({ error: false, message: 'User banned successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

//@desc     Unban a user
//@route    PUT /api/admin/unban/:id
//@access   Private

const unbanUser = async (req, res) => {
    const { id } = req.params;

    try {

        if (req.isAdmin == false) {
            return res.status(403).json({ error: true, message: 'Not authorized as an admin' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ error: true, message: 'User not found' });
        }

        user.isBan = false;
        await user.save();

        const data = {
            email: user.email,
            action: 'Unbanned',
        };

        sendMail('adminAccountAction', data);

        return res.status(200).json({ error: false, message: 'User unbanned successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


//@desc     Delete an item
//@route    DELETE /api/admin/item/:id
//@access   Private

const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {

        if (req.isAdmin == false) {
            return res.status(403).json({ error: true, message: 'Not authorized as an admin' });
        }

        const item = await Item.findOne({ _id: id, status: 'available' }).populate('owner', 'email');

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

        const data = {
            email: item.owner.email,
            itemName: item.name,
        };

        sendMail('adminItemDelete', data);

        return res.status(200).json({ error: false, message: 'Item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }

}

module.exports = { login, logout, getAllUsers, getAllItems, banUser, unbanUser, deleteItem };