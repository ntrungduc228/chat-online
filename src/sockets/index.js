const addNewContact = require('./contact/addNewContact');
const removeRequestContact = require('./contact/removeRequestContact');

/**
 * 
 * @param io from socket.io library 
 */

let initSockets = (io) => {
    addNewContact(io);
    removeRequestContact(io);
}

module.exports = initSockets;