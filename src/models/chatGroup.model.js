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
    createNew(item){
        return this.create(item);
    },

    /**
     * Get chat group items by userid and limit
     * @param {string} userId 
     * @param {string} limit 
     */
    getChatGroups(userId, limit) {
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }).sort({"updatedAt": -1}).limit(limit).exec();
    },

    /**
     * 
     * @param {string} id 
     */
    getChatGroupById(id) {
        return this.findById(id).exec();
    },

    /**
     * Update chat group when has a new message
     * @param {string} id of group chat
     * @param {number} newMessageAmount 
     */
    updateWhenHasNewMessage(id, newMessageAmount) {
        return this.findByIdAndUpdate(id, {
            "messageAmount": newMessageAmount,
            "updatedAt": Date.now(),
        }).exec();
    },


    getChatGroupIdsByUser(userId){
        return this.find({
            "members": {$elemMatch: {"userId": userId}}
        }, {_id: 1}).exec();
    },
};


const ChatGroup = mongoose.model('Chat-group', ChatGroupSchema);

module.exports = ChatGroup;