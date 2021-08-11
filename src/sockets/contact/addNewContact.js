const {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray } = require('../../helpers/socket');

/**
 * 
 * @param io from socket.io library 
 */

function addNewContact(io) {    
    let clients = {};
    io.on('connection', (socket) => {

        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("add-new-contact", (data) => { 
           
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address != null) ? socket.request.user.address : "",
            };

            if(clients[data.contactId]){
                emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
            }
        });

        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });

        
        // console.log(clients)
    })
}

module.exports = addNewContact;