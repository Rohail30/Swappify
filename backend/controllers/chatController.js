const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");


// @desc   Get chat between two users
// @route  GET /api/chat/:reciever
// @access Private
const getChat = async (req, res) => {
    const userId = req.userId;
    const reciever = req.params.reciever;

    if (!userId || !reciever) {
        return res.status(400).json({ error: true, message: 'Sender and Reciever are required' });
    }

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, reciever] }
        }).populate('messages.from', 'name');

        if (!chat) {
            chat = new Chat({
                participants: [userId, reciever],
                messages: []
            });
            await chat.save();
        }

        return res.status(200).json(chat ? chat.messages : []);
    }
    catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}


// @desc Handle sending a message
const handleSocketMessage = async (io, socket, { sender, receiver, text }) => {
    const roomId = [sender, receiver].sort().join('_');

    let chat = await Chat.findOne({
        participants: { $all: [sender, receiver] }
    });

    if (!chat) {
        chat = new Chat({
            participants: [sender, receiver],
            messages: []
        });
    }

    const message = { from: sender, text };
    chat.messages.push(message);
    await chat.save();

    await chat.populate({ path: 'messages.from', select: 'name' });
    const populatedMessage = chat.messages[chat.messages.length - 1];

    io.to(roomId).emit('receiveMessage', populatedMessage);
};


module.exports = { getChat, handleSocketMessage };