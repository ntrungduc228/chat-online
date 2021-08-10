const ContactModel = require('../models/contact.model');
const UserModel = require('../models/user.model');
const NotificationModel = require('../models/notification.model');


const _ = require('lodash');

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
       let deprecatedUserIds = [currentUserId];
       let contactByUser = await ContactModel.findAllByUser(currentUserId); // find all people who are user's friend before
       contactByUser.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);

    })
}

let addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModel.checkExists(currentUserId, contactId);
        if(contactExists){
            return reject(false);
        }

        // Create contact
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId,
        };

        let newContact = await ContactModel.createNew(newContactItem);

        // Notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.ADD_CONTACT,
        };

        await NotificationModel.model.createNew(notificationItem);

        resolve(newContact);
    })
}

let removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
       let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
       if(removeReq.n === 0) {
           return reject(false);
       }

       // Remove notification
       let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
       await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, notifTypeAddContact);
       resolve(true);
    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact,
};