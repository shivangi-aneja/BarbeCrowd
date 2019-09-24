"use strict";

const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
    from: { // The Sender of the Invitation
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: { // The Receiver of the Invitation
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event',
        required: true
    },
    asHost: { // Receiver is invited to be a host
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['accepted', 'pending', 'rejected'],
        default: 'pending'
    }
});

InvitationSchema.set('versionKey', false);

module.exports = mongoose.model('Invitation', InvitationSchema);