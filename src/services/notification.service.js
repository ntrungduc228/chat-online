const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/user.model');

const LIMIT_NUMBER_TAKEN = 10;

/**
 * Get notification when f5 page
 * just 10 item one time
 * @param {string} currentUserId 
 * @param {number} limit 
 */

let getNotifications = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);

            let getNotifContents = notifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
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


/**
 * Read more new notifications max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumber 
 * @returns 
 */
 let readMore = (currentUserId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try{
           let newNotifications = await NotificationModel.model.readMore(currentUserId, skipNumber, LIMIT_NUMBER_TAKEN);

           let getNotifContents = newNotifications.map(async (notification) => {
                let sender = await UserModel.getNormalUserDataById(notification.senderId);
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
 * Mark all notifications as read
 * @param {string} currentUserId 
 * @param {array} targetUsers 
 * @returns 
 */
let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async (resolve, reject) => {
        try{
            await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);
        }   
        catch(error) {
            console.log(`Error when mark notifications as read: ${error}`);
            reject(false);
        }
    });
}

module.exports = {
    getNotifications,
    countNotifUnRead,
    readMore,
    markAllAsRead,
}