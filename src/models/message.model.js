const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    senderId: String,
    receiverId: String,
    conversationType: String,
    messageType: String,
    sender: {
        id: String,
        name: String,
        avatar: String
    },
    receiver: {
        id: String,
        name: String,
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

MessageSchema.statics = {
    /**
     * Create new item
     * @param {object} item 
     */
    createNew(item){
        return this.create(item);
    },

    /**
     * Get message of personal limited one time
     * @param {string} senderId currentUserId
     * @param {string} receiverId id of currentUser's contact
     * @param {number} limit 
     */
     getMessagesInPersonal(senderId, receiverId, limit){
        return this.find({
            $or: [
                {$and: [
                    {"senderId": senderId},
                    {"receiverId": receiverId},
                ]},
                {$and: [
                    {"receiverId": senderId},
                    {"senderId": receiverId},
                ]}
            ]
        }).sort({"createdAt": 1}).limit(limit).exec();
    },

    /**
     * Get message in group
     * @param {string} receiverId id of group chat
     * @param {number} limit 
     */
    getMessagesInGroup(receiverId, limit){
        return this.find({ "receiverId": receiverId }).sort({"createdAt": 1}).limit(limit).exec();
    },
};

const MESSAGE_CONVERSATION_TYPES = {
    PERSONAL: "personal",
    GROUP: "group",
};

const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
    model: Message,
    conversationTypes: MESSAGE_CONVERSATION_TYPES,
    messageTypes: MESSAGE_TYPES,
};