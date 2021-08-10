const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    senderId: String,
    receiverId: String,
    type: String,
    isRead: {type: Boolean, default: false},
},{
    timestamps: true,
})

NotificationSchema.statics = {
    createNew(item){
      return this.create(item);
    },

    removeRequestContactNotification(senderId, receiverId, type){
        return this.deleteOne({
            $and: [
                {"senderId": senderId},
                {"receiverId": receiverId},
                {"type": type},
            ]
        }).exec();
    },

    /**
     * Get by userId and limit
     * @param {string} userId 
     * @param {number} limit 
     * @returns 
     */

    getByUserIdAndLimit(userId, limit) {
        return this.find({ "receiverId" : userId }).sort({"createdAt": -1}).limit(limit).exec();
    },

    /**
     * Count all notifications unread
     * @param {string} userId 
     * @returns 
     */
     countNotifUnRead(userId) {
        return this.countDocuments({
            $and: [
                {"receiverId" : userId },
                {"isRead" : false},
            ]
        }).exec();
    },
};

const NOTIFICATION_TYPES = {
    ADD_CONTACT: "add_contact",
};

const NOTIFICATION_CONTENTS = {
    getContent(notificationType, isRead, userId, userName, userAvatar) {
        if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT){

            if(!isRead) {
                return `<div class="notif-readed-false" data-uid="${ userId }">
                    <img class="avatar-small" src="images/users/${userAvatar} " alt=""> 
                    <strong>${userName} </strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
            }

            return `<div data-uid="${ userId }">
                    <img class="avatar-small" src="images/users/${userAvatar} " alt=""> 
                    <strong>${userName} </strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;

            
        }
        return "No matching with any type";
    }
} 

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
    model: Notification,
    types: NOTIFICATION_TYPES,
    content: NOTIFICATION_CONTENTS,
};