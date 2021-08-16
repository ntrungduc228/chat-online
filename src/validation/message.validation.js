const {check} = require('express-validator');
const {transValidation} = require('../../lang/vi');

let checkMessageLength = [
    check("messageVal", transValidation.message_text_emoji_incorrect)
    .isLength({ min: 1, max: 400 })
];

module.exports = {
    checkMessageLength,
};