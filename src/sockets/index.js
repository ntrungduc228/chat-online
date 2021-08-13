const addNewContact = require('./contact/addNewContact');
const removeRequestContactSent = require('./contact/removeRequestContactSent');
const removeRequestContactReceived = require('./contact/removeRequestContactReceived');
const approveRequestContactReceived = require('./contact/approveRequestContactReceived');


/**
 * 
 * @param io from socket.io library 
 */

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
    approveRequestContactReceived(io);
}

module.exports = initSockets;