const ContactModel = require('../models/contact.model');
const UserModel = require('../models/user.model');
const ChatGroupModel = require('../models/chatGroup.model');
const MessageModel = require('../models/message.model');

const _ = require('lodash');

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGES_TAKEN = 30;


/**
 * Get all conversations
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);

            let userConversationsPromise = contacts.map(async (contact) => {
                if(contact.contactId == currentUserId){
                    let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
                    // getUserContact = getUserContact.toObject();
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }else {
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
                    // getUserContact = getUserContact.toObject();
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });

            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);

            allConversations = _.sortBy(allConversations, item => {
                return -item.updatedAt;
            });

            // Get messages to apply screen chat
            let allConversationWithMessagesPromise = allConversations.map(async (conversation) => {
                conversation = conversation.toObject();

                if(conversation.members) {
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = getMessages;
                }else {
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);
                    conversation.messages = getMessages;
                }
                
                return conversation;
            });

            let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);

            // Sort by updatedAt desending
            allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
                return -item.updatedAt;
            });

            resolve({
                allConversationWithMessages,
            });

        }
        catch(error){
            reject(error);
        }
    });
};

module.exports = {
    getAllConversationItems,
};