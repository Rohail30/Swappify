const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');


// @desc    Get User details
// @route   GET /api/users/:userId
// @access  Public

const getUser = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ error: true, message: 'User ID is required' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        return res.status(200).json({ error: false, user });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}



// @desc    Update User details
// @route   PUT /api/users/:userId
// @access  Private

const updateUser = async (req, res) => {
    const userId = req.params.userId
    const { name, email, password, mobile } = req.body;

    if (!userId) {
        return res.status(400).json({ error: true, message: 'User ID is required' });
    }

    if (!validator.isEmail(email) || !validator.isMobilePhone(mobile, 'en-PK')) {
        return res.status(400).json({ error: true, message: 'Invalid email or mobile number' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: true, message: 'User not found' });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            var hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedData = await User.findByIdAndUpdate(userId, { name, email, password: hashedPassword, mobile }, { new: true });

        return res.status(200).json({ error: false, message: 'User updated successfully', updatedData });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Get all Users
// @route   GET /api/users
// @access  Public

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({ error: false, users });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


module.exports = { getUser, updateUser, getAllUsers };