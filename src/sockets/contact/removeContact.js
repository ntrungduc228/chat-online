const {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray } = require('../../helpers/socket');

/**
 * 
 * @param io from socket.io library 
 */

 function removeContact(io) {    
    let clients = {};
    io.on('connection', (socket) => {

        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-contact", (data) => { 
           
            let currentUser = {
                id: socket.request.user._id,
            };

            // Emit notification
            if(clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-remove-contact", currentUser);
            }
        });

        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });

        // console.log(clients)
    })
}

module.exports = removeContact;