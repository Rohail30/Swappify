const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);