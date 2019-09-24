"use strict";

const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }

});

EventSchema.set('versionKey', false);

module.exports = mongoose.model('Event', EventSchema);