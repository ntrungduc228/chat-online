const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 150},
    messageAmount: { type: Number, default: 0},
    userId: String,
    members: [
        {userId: String},
    ],
    deletedAt: { type: Date, default: Date.now() },
},{
    timestamps: true,
})

const ChatGroup = mongoose.model('Chat-group', ChatGroupSchema);

module.exports = ChatGroup;