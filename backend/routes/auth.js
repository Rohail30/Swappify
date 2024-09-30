const express = require('express');
const router = express.Router();

const { register, login, verifyAccount } = require('../controllers/authController');


// @desc    Register a new user
router.post('/register', register);

// @desc    Login a user
router.post('/login', login);

// @desc    Verify user account
router.get('/verify/:userId/:token', verifyAccount);


module.exports = router;