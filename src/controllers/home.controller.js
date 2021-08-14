const {notification, contact, message} = require('../services');
const {bufferToBase64} = require('../helpers/client');

class HomeController{
    
    async getHomePage(req, res, next) {
        // Only 10 items one time
        let notifications = await notification.getNotifications(req.user._id);
        // Get amount notification unread
        let countNotifUnRead = await notification.countNotifUnRead(req.user._id);

        // Get contacts friend-list (10 item one time)
        let contacts = await contact.getContacts(req.user._id);
        // Get contacts sent (10 item one time)
        let contactsSent = await contact.getContactsSent(req.user._id);
        // Get contacts received (10 item one time)
        let contactsReceived = await contact.getContactsReceived(req.user._id);
        
        // Count Contacts
        let countAllContacts = await contact.countAllGetContacts(req.user._id);
        let countAllContactsSent = await contact.countAllGetContactsSent(req.user._id);
        let countAllContactsReceived = await contact.countAllGetContactsReceived(req.user._id);


        let getAllConversationItems = await message.getAllConversationItems(req.user._id);
        let allConversations = getAllConversationItems.allConversations;
        let userConversations = getAllConversationItems.userConversations;
        let groupConversations = getAllConversationItems.groupConversations;
        // All message with conversation max 30 items
        let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

        res.render('main/components/home', {
            errors: req.flash("errors"),
            success: req.flash("success"),
            user: req.user,
            notifications: notifications,
            countNotifUnRead: countNotifUnRead,
            contacts: contacts,
            contactsSent: contactsSent,
            contactsReceived: contactsReceived,
            countAllContacts: countAllContacts,
            countAllContactsSent: countAllContactsSent,
            countAllContactsReceived: countAllContactsReceived,
            allConversations: allConversations,
            userConversations: userConversations,
            groupConversations: groupConversations,
            allConversationWithMessages: allConversationWithMessages,
            bufferToBase64: bufferToBase64,

        });
    }
}

module.exports = new HomeController();