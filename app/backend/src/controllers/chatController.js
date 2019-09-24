"use strict";
const ChatModel = require('../models/chatMessageModel');
const NotificationModel = require('../models/notificationModel');
const socket = require('../routes/socket');
const {emitNotification} = require('./notificationController');

//creates a chatMessage object and sends it via socket to an event
const create = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'Can not send an empty message'
    });

    let chatMessage = { ...req.body, eventID: req.params.event, userID: req.userID };
    try {
        chatMessage = await ChatModel.create(chatMessage);
        res.status(201).json({ message: `Created 1 item.` });
        chatMessage = await chatMessage.populate('userID', '_id name').execPopulate();
        socket.sendMessage(req.params.event, chatMessage);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error', 
            message: error.message
        });
    }
};
//lists all chat messages of a specific event
const list = (req, res) => {
    ChatModel.find({ eventID: req.params.event })
        .populate('userID', '_id name').exec()
        .then(chatMessages => res.status(200).json(chatMessages))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

module.exports = {
    create,
    list
};