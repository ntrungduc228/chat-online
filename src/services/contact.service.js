const ContactModel = require('../models/contact.model');
const UserModel = require('../models/user.model');
const NotificationModel = require('../models/notification.model');

const _ = require('lodash');

const LIMIT_NUMBER_TAKEN = 10;

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

let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
         let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);

         let users = contacts.map(async (contact) => {
            if(contact.contactId == currentUserId){
                return await UserModel.findUserById(contact.userId);
            }else {
                return await UserModel.findUserById(contact.contactId);
            }
         });

         resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}

let getContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
        let contacts = await ContactModel.getContactsSent(currentUserId, LIMIT_NUMBER_TAKEN);

        let users = contacts.map(async (contact) => {
           return await UserModel.findUserById(contact.contactId);
        });

        resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}

let getContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
        let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);

        let users = contacts.map(async (contact) => {
           return await UserModel.findUserById(contact.userId);
        });

        resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}

let countAllGetContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
         let count = await ContactModel.countAllGetContacts(currentUserId);
         resolve(count);
        resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}

let countAllGetContactsSent = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
         let count = await ContactModel.countAllGetContactsSent(currentUserId);
         resolve(count);
        resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}

let countAllGetContactsReceived = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
         let count = await ContactModel.countAllGetContactsReceived(currentUserId);
         resolve(count);
        resolve(await Promise.all(users));
       }
       catch(error){
           reject(error);
       }
    })
}


module.exports = {
    findUsersContact,
    addNew,
    removeRequestContact,
    getContacts,
    getContactsSent,
    getContactsReceived,
    countAllGetContacts,
    countAllGetContactsSent,
    countAllGetContactsReceived
};