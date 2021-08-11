const addNewContact = require('./contact/addNewContact');
const removeRequestContactSent = require('./contact/removeRequestContactSent');

/**
 * 
 * @param io from socket.io library 
 */

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContactSent(io);
}

module.exports = initSockets;