const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/UserModel');
const VerificationToken = require('../models/VerificationTokenModel');
const sendMail = require('../config/nodemailer');


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

const register = async (req, res) => {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password || !mobile) {
        return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
    }

    if (!validator.isEmail(email) || !validator.isMobilePhone(mobile, 'en-PK')) {
        return res.status(400).json({ error: true, message: 'Please enter a valid email and mobile number' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: true, message: 'User already exists with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        const verificationToken = await VerificationToken.create({ userId: user._id, token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET) });

        const emailText = `<a href="http://localhost:5000/api/auth/verify/${user._id}/${verificationToken.token}">Click here to verify your account</a>`;

        await sendMail(email, 'Account Verification', emailText);

        return res.status(200).json({ error: false, message: 'User registered successfully. Please verify your email' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: 'Please enter a valid email' });
    }

    if (!email || !password) {
        return res.status(400).json({ error: true, message: 'Please enter all the required fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(400).json({ error: true, message: 'Please verify your email' });
        }

        const age = 7 * 24 * 60 * 60 * 1000; // 7 days

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: age });

        return res.cookie("token", token, { httpOnly: true, maxAge: age }).status(200).json({ error: false, message: 'User logged in successfully', user });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc    Verify a user
// @route   GET /api/auth/verify/:userId/:token
// @access  Public

const verifyAccount = async (req, res) => {
    const { userId, token } = req.params;

    try {
        const verificationToken = await VerificationToken.findOne({ userId, token });
        const user = await User.findById(userId);

        if (!verificationToken || !user) {
            return res.status(400).json({ error: true, message: 'Invalid token' });
        }

        user.verified = true;
        await user.save();

        await VerificationToken.deleteOne({ userId, token });

        return res.status(200).json({ error: false, message: 'User verified successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


//@desc     Forgot Password
//@route    POST /api/auth/forgotpassword
//@access   Public

const forgotPassword = async (req, res) => {
    const { email, mobile } = req.body;

    if (!validator.isEmail(email) || !validator.isMobilePhone(mobile, 'en-PK')) {
        return res.status(400).json({ error: true, message: 'Please enter a valid email and mobile number' });
    }

    try {
        const user = await User.findOne({ email, mobile });

        if (!user) {
            return res.status(400).json({ error: true, message: 'User not found with this email and mobile' });
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        console.log(randomPassword);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user.password = hashedPassword;
        await user.save();

        const emailText = `Your new password is ${randomPassword} Please change it after login`;

        sendMail(email, 'New Password', emailText);

        return res.status(200).json({ error: false, message: 'New password sent to your email' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


//@desc     Logout User
//@route    GET /api/auth/logout
//@access   Private

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ error: false, message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


module.exports = { register, login, verifyAccount, forgotPassword, logout };