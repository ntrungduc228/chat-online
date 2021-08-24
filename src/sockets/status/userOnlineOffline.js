const {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray } = require('../../helpers/socket');

/**
 * 
 * @param io from socket.io library 
 */

function userOnlineOffline(io) {
    let clients = {};
    io.on('connection', (socket) => {

        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });

        let listUsersOnline = Object.keys(clients);
        // Step 1: Emit to user after log in or f5 refresh
        socket.emit("server-send-list-users-online", listUsersOnline);

        // Step 2: Emit to all another users when has new user online (log in)
        socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);


        socket.on("disconnect", () => {
            clients =  removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });

         // Step 03:  Emit to all another users when has new user offline (log out)
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
            
        });

    })
}

module.exports = userOnlineOffline;