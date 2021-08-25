const authService = require ("./auth.service");
const userService = require ("./user.service");
const contactService = require("./contact.service");
const notificationService = require("./notification.service");
const messageService = require("./message.service");
const groupChatService = require("./groupChat.service");


const auth = authService;
const user = userService;
const contact = contactService;
const notification = notificationService;
const message = messageService;
const groupChat = groupChatService;

module.exports = { 
    auth,
    user,
    contact,
    notification,
    message,
    groupChat,
};