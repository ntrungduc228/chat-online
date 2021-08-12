const addNewContact = require('./contact/addNewContact');
const removeRequestContactSent = require('./contact/removeRequestContactSent');
const removeRequestContactReceived = require('./contact/removeRequestContactReceived');


/**
 * 
 * @param io from socket.io library 
 */

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
    removeRequestContactReceived(io);
}

module.exports = initSockets;