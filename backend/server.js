const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});