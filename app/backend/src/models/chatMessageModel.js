"use strict";

const mongoose = require('mongoose');


const chatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },

    eventID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Event',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    
});

chatMessageSchema.set('versionKey', false);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

