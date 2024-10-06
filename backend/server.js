const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});