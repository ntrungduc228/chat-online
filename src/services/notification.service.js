const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/user.model');


/**
 * Get notification when f5 page
 * just 10 item one time
 * @param {string} currentUserId 
 * @param {number} limit 
 */

let getNotifications = (currentUserId, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try{
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);

            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar); 
            });

            resolve(await Promise.all(getNotifContents));
        }
        catch(error) {
            reject(error);
        }
    });
}

/**
 * Count all notifications unread
 * @param {string} currentUserId 
 * @returns 
 */
let countNotifUnRead = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try{
           let notificationsUnRead = await NotificationModel.model.countNotifUnRead(currentUserId);
           resolve(notificationsUnRead);
        }
        catch(error) {
            reject(error);
        }
    });
}

module.exports = {
    getNotifications,
    countNotifUnRead,
}