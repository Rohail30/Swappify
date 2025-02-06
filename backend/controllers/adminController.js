const User = require('../models/UserModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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


module.exports = { login, logout, getAllUsers };