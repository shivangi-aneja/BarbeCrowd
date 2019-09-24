let io = require('socket.io');
const jwt    = require('jsonwebtoken');
const InvitationModel = require('../models/invitationModel');
const config = require ('../config');

/**
 * 'knock' on an event room. Verifies JWT token and event membership for socket endpoint.
 * Joins the room if verification succeeds
 * @param {object} token the JWT token of the user
 * @param {object} room the _id of the event used as room
 * @param {object} socket the socket object
 */
const knock = (token, room, socket) => {
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err) return
        userID = decoded._id;

        InvitationModel.findOne({to: userID, event: room, status: 'accepted'}).exec()
            .then(invitation => {
                if(invitation) {
                    socket.join(room);
                }
            })
        .catch(error => console.error(error));
    });
}

const initialize = function (server) {
    io = io.listen(server); //start listening on server

    //new client has opened a connection
    io.on("connection", function (socket) {

        //get requested room and verify
        const query = socket.handshake.query;
        if(query.room && query.token) {
            knock(query.token, query.room, socket);
        }

        //leave event handler is received
        socket.on('leave', id => {
            socket.leave(id);
        });
    });
};


// send real-time updates
const addItem = (eventID, item) => {
    io.to(eventID).emit('addItem', item);
}

const editItem = (eventID, item) => {
    io.to(eventID).emit('editItem', item);
}

const addInvitation = (eventID, invitation) => {
    io.to(eventID).emit('addInvitation', invitation);
}

const editInvitation = (eventID, invitation) => {
    io.to(eventID).emit('editInvitation', invitation);
}

const deleteItem = (eventID, itemID) => {
    io.to(eventID).emit('deleteItem', itemID);
}

const sendMessage = (eventID, message) => {
    io.to(eventID).emit('addMessage', message);
    
}

module.exports = {
    initialize,
    addItem,
    editItem,
    deleteItem,
    addInvitation,
    editInvitation,
    sendMessage
};