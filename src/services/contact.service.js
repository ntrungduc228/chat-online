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

let removeContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let removeContact = await ContactModel.removeContact(currentUserId, contactId);
        if(removeContact.n === 0) {
            return reject(false);
        }
 
        resolve(true);
     })
}

let removeRequestContactSent = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
       let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
       if(removeReq.n === 0) {
           return reject(false);
       }

       // Remove notification
       let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
       await NotificationModel.model.removeRequestContactSentNotification(currentUserId, contactId, notifTypeAddContact);
       resolve(true);
    })
}

let removeRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
       let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
       if(removeReq.n === 0) {
           return reject(false);
       }

       // Remove notification
       // Ch???c n??ng n??y ch??a mu???n l??m =))
       //let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
       //await NotificationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, notifTypeAddContact);
       resolve(true);
    })
}

let approveRequestContactReceived = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
       let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
    //    console.log('approve', approveReq);
       if(approveReq.nModified === 0) {
           return reject(false);
       }

       // Create notification
        let notificationItem = {
            senderId: currentUserId,
            receiverId: contactId,
            type: NotificationModel.types.APPROVE_CONTACT,
        };

        await NotificationModel.model.createNew(notificationItem);
       resolve(true);
    })
}

let getContacts = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
       try{
         let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);

         let users = contacts.map(async (contact) => {
            if(contact.contactId == currentUserId){
                return await UserModel.getNormalUserDataById(contact.userId);
            }else {
                return await UserModel.getNormalUserDataById(contact.contactId);
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
           return await UserModel.getNormalUserDataById(contact.contactId);
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
           return await UserModel.getNormalUserDataById(contact.userId);
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

/**
 * Read more contacts
 * @param {string} currentUserId 
 * @param {number} skipNumber 
 * @returns 
 */
let readMoreContacts = (currentUserId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try{
           let newContacts = await ContactModel.readMoreContacts(currentUserId, skipNumber, LIMIT_NUMBER_TAKEN);

           let users = newContacts.map(async (contact) => {
                if(contact.contactId == currentUserId){
                    return await UserModel.getNormalUserDataById(contact.userId);
                }else {
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
           });

           resolve(await Promise.all(users));
        }
        catch(error) {
            reject(error);
        }
    });
}

/**
 * Read more contacts sent
 * @param {string} currentUserId 
 * @param {number} skipNumber 
 * @returns 
 */

let readMoreContactsSent = (currentUserId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try{
           let newContacts = await ContactModel.readMoreContactsSent(currentUserId, skipNumber, LIMIT_NUMBER_TAKEN);

           let users = newContacts.map(async (contact) => {
                if(contact.contactId == currentUserId){
                    return await UserModel.getNormalUserDataById(contact.userId);
                }else {
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
           });

           resolve(await Promise.all(users));
        }
        catch(error) {
            reject(error);
        }
    });
}

/**
 * Read more contacts received
 * @param {string} currentUserId 
 * @param {number} skipNumber 
 * @returns 
 */

 let readMoreContactsReceived = (currentUserId, skipNumber) => {
    return new Promise(async (resolve, reject) => {
        try{
           let newContacts = await ContactModel.readMoreContactsReceived(currentUserId, skipNumber, LIMIT_NUMBER_TAKEN);

           let users = newContacts.map(async (contact) => {
                if(contact.contactId == currentUserId){
                    return await UserModel.getNormalUserDataById(contact.userId);
                }else {
                    return await UserModel.getNormalUserDataById(contact.contactId);
                }
           });

           resolve(await Promise.all(users));
        }
        catch(error) {
            reject(error);
        }
    });
}

let searchFriends = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let friendIds = [];
        let friends = await ContactModel.getFriends(currentUserId);

        friends.forEach((item) => {
            friendIds.push(item.userId);
            friendIds.push(item.contactId);
        });

        friendIds = _.uniqBy(friendIds);
        friendIds = friendIds.filter((userId) => userId != currentUserId);

        users = await UserModel.findAllToAddGroupChat(friendIds, keyword);

        resolve(users);

    })
}

module.exports = {
    findUsersContact,
    addNew,
    removeContact,
    removeRequestContactSent,
    removeRequestContactReceived,
    approveRequestContactReceived,
    getContacts,
    getContactsSent,
    getContactsReceived,
    countAllGetContacts,
    countAllGetContactsSent,
    countAllGetContactsReceived,
    readMoreContacts,
    readMoreContactsSent,
    readMoreContactsReceived,
    searchFriends,
};