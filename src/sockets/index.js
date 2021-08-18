const addNewContact = require('./contact/addNewContact');
const removeRequestContactSent = require('./contact/removeRequestContactSent');
const removeRequestContactReceived = require('./contact/removeRequestContactReceived');
const approveRequestContactReceived = require('./contact/approveRequestContactReceived');
const removeContact = require('./contact/removeContact');
const chatTextEmoji = require('./chat/chatTextEmoji');

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
}

module.exports = initSockets;