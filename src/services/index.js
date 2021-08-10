const authService = require ("./auth.service");
const userService = require ("./user.service");
const contactService = require("./contact.service");
const notificationService = require("./notification.service");

const auth = authService;
const user = userService;
const contact = contactService;
const notification = notificationService;

module.exports = { 
    auth,
    user,
    contact,
    notification,
};