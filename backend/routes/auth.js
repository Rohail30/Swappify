const express = require('express');
const router = express.Router();

const { register, login, verifyAccount, forgotPassword } = require('../controllers/authController');


// @desc    Register a new user
router.post('/api/auth/register', register);

// @desc    Login a user
router.post('/api/auth/login', login);

// @desc    Verify user account
router.get('/api/auth/verify/:userId/:token', verifyAccount);

// @desc    Forgot password
router.post('/api/auth/forgotpassword', forgotPassword);

module.exports = router;