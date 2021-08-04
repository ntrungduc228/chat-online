const authService = require ("./auth.service");
const userService = require ("./user.service");

const auth = authService;
const user = userService;

module.exports = { 
    auth,
    user,
};