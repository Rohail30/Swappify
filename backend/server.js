const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');


// Middleware
app.use(express.json());
app.use(authRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});