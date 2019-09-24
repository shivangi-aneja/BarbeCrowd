"use strict";

const mongoose = require('mongoose');

const categories = ["Beverages", "Starters", "Deserts", "Utility", "Main Course", "Sides", "Other"];

const ItemSchema  = new mongoose.Schema({
    requested: { // The User requesting this item to be brought to the event
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    assigned: { // The User declaring to bring the item to the event
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2
    },
    cost: {
        type: Number,
        min: 0,
        max: 9999
    },
    amount: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 12,
    },
    category: {
        type: String,
        enum: categories,
        required: true
    }
});

ItemSchema.set('versionKey', false);

module.exports = {
    ItemModel: mongoose.model('Item', ItemSchema),
    categories
}