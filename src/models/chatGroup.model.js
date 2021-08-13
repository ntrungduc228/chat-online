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
});

ChatGroupSchema.statics = {

    /**
     * Get chat group items by userid and limit
     * @param {string} userId 
     * @param {string} limit 
     */
    getChatGroups(userId, limit) {
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }).sort({"createdAt": -1}).limit(limit).exec();
    },
};


const ChatGroup = mongoose.model('Chat-group', ChatGroupSchema);

module.exports = ChatGroup;