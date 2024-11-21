const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');
const wishlistRoutes = require('./routes/wishlist');
const tradeRoutes = require('./routes/trade');

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(userRoutes);
app.use(itemRoutes);
app.use(wishlistRoutes);
app.use(tradeRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
