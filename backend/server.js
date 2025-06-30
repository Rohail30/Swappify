const express = require('express');
const http = require('http');
const socketIo = require('socket.io')
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
const ratingRoutes = require('./routes/rating');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');
const { handleSocketMessage } = require('./controllers/chatController')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
  pingInterval: 30000,
  pingTimeout: 600000
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(userRoutes);
app.use(itemRoutes);
app.use(wishlistRoutes);
app.use(tradeRoutes);
app.use(ratingRoutes);
app.use(adminRoutes);
app.use(chatRoutes);

io.on('connection', (socket) => {
  // console.log('Client connected');

  socket.on('joinRoom', ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join('_');
    socket.join(roomId);
  });

  socket.on('sendMessage', (data) => {
    handleSocketMessage(io, socket, data);
  });

  socket.on('disconnect', () => {
    // console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
