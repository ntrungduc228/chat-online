const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    text: String,
    file: { 
        data: Buffer,
        contentType: String,
        fileName: String,
    },
    deletedAt: { type: Date, default: Date.now() },
},{
    timestamps: true,
})

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;