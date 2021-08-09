let pushSocketIdToArray = (clients, userId, socketId) => {

    if(clients[userId]){
        clients[userId].push(socketId);
    }else{
        clients[userId]= [socketId];
    }

    return clients;
};

let emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => {
        // socket.io version >= 3.0.0
      return  io.sockets.sockets.get(socketId).emit(eventName, data);
        // socket.io version < 3.0.0
       // return io.sockets.connected[socketId].emit("response-add-new-contact", currentUser);
    });
};

let removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter((socketId) => socketId !== socket.id);
    if(!clients[userId].length){
        delete clients[userId]; 
    }

    return clients;
};

module.exports = {
    pushSocketIdToArray,
    emitNotifyToArray,
    removeSocketIdFromArray,
}