const authService = require ("./auth.service");
const userService = require ("./user.service");
const contactService = require("./contact.service");

const auth = authService;
const user = userService;
const contact = contactService;

module.exports = { 
    auth,
    user,
    contact,
};