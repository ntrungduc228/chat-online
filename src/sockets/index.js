const addNewContact = require('./contact/addNewContact');
const removeRequestContactSent = require('./contact/removeRequestContactSent');
const removeRequestContactReceived = require('./contact/removeRequestContactReceived');
const approveRequestContactReceived = require('./contact/approveRequestContactReceived');
const removeContact = require('./contact/removeContact');
const chatTextEmoji = require('./chat/chatTextEmoji');
const typingOn = require('./chat/typingOn');
const typingOff = require('./chat/typingOff');
const chatImage = require('./chat/chatImage');


/**
 * 
 * @param io from socket.io library 
 */

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
    removeContact(io);
    chatTextEmoji(io);
    typingOn(io);
    typingOff(io);
    chatImage(io);
}

module.exports = initSockets;