const ContactModel = require('../models/contact.model');
const UserModel = require('../models/user.model');

const _ = require('lodash');

let findUsersContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
       let deprecatedUserIds = [];
       let contactByUser = await ContactModel.findAllByUser(currentUserId);
       contactByUser.forEach((contact) => {
            deprecatedUserIds.push(contact.userId);
            deprecatedUserIds.push(contact.contactId);
        });

        deprecatedUserIds = _.uniqBy(deprecatedUserIds);
        let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
        resolve(users);

    })
}

module.exports = {
    findUsersContact,
};