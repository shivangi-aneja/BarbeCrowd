"use strict";

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['inv', 'msg', 'reminder', 'join', 'item'],
        required: true
    },
    isMessage: { //Notification should be displayed as a message rather than an update
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 255
    },
    isRead: {
        type: Boolean,
        default: false
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

NotificationSchema.set('versionKey', false);

module.exports = mongoose.model('Notification', NotificationSchema);