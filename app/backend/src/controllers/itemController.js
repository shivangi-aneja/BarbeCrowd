"use strict";

const {ItemModel, categories} = require('../models/itemModel');
const {emitNotification} = require('./notificationController');
const socket = require('../routes/socket');

/**
 * Creates and stores a new item and sends real-time update
 */
const create = async (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });
    if (!req.body.assigned !== !req.body.cost) return res.status(400).json({
        error: 'Bad Request',
        message: 'If a user is assigned then a cost has to be provided and vice versa'
    });

    if (!req.inv.asHost && req.body.assigned && (req.userID !== req.body.assigned)) return res.status(403).json({
        error: 'Forbidden',
        message: 'Only hosts can assign users other than themselves to an item'
    });
    
    let item = { ...req.body, event: req.params.event, requested: req.userID };
    try {
        //create the item
        item = await ItemModel.create(item);
        res.status(201).json({message: `Created 1 item.`});
        //populate name of requester (needed in itemtable) and send real-time update
        item = await item.populate('requested', '_id name').execPopulate();
        socket.addItem(req.params.event, item);
    }catch(error){
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

/**
 * Edits an item and sends real-time update
 */
const edit = async (req, res) => {
    if(!req.inv.asHost) {
        // non-hosts can only edit name, amount and category of an item iff it is not already assigned
        try {
            // Update the item and return the new one. Populate names of assigned and requesting users (needed in itemtable)
            let item = await ItemModel.findOneAndUpdate({_id: req.params.id, event: req.params.event, requested: req.userID, assigned: undefined},
                {name: req.body.name, amount: req.body.amount, category: req.body.category}, { runValidators: true, new: true })
                .populate('requested', '_id name').populate('assigned', '_id name').exec();
            if(!item){
                return res.status(400).json({
                    error: 'Bad Request',
                    message: 'Item not found, not requested by you or already assigned to someone.'
                });
            }
            res.status(200).json({ message: `Updated 1 item.` });
            //send real-time update
            socket.editItem(req.params.event, item);
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error
            });
        }
    // Assigned user and item cost can only be updated as a collective
    } else if (!req.body.assigned !== !req.body.cost) {
        res.status(400).json({
            error: 'Bad Request',
            message: 'If a user is assigned then a cost has to be provided and vice versa'
        });
    } else {
        try {
            // Update the item and return the new one. Populate names of assigned and requesting users
            let item = await ItemModel.findOneAndUpdate({_id: req.params.id, event: req.params.event},
                {name: req.body.name, amount: req.body.amount, category: req.body.category, cost: req.body.cost, assigned: req.body.assigned}, { runValidators: true, new: true })
                .populate('requested', '_id name').populate('assigned', '_id name').exec();
            if(!item){
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Item not found.'
                });
            }
            res.status(200).json({message: `Updated 1 item.`});
            //send notification if item of someone else was edited
            if(item.requested._id.toString() !== req.userID)
                emitNotification(item.event.toString(), `Your request of '${item.name}' was edited!`, "item", item.requested._id)
                    .catch(e => console.error(e));
            if((item.assigned._id.toString() !== req.userID) && (item.assigned._id.toString() !== item.requested._id.toString()))
                emitNotification(item.event.toString(), `Your assignment of '${item.name}' was edited!`, "item", item.assigned._id)
                    .catch(e => console.error(e));
            //send real-time update
            socket.editItem(req.params.event, item);
        } catch (error) {
            res.status(500).json({
                error: 'Internal server error',
                message: error
            });
        }
    }
}

/**
 * Assigns an item to the user with the specified cost and sends real-time update
 */
const assign = async (req, res) => {
    if (Object.keys(req.body).length === 0 || !req.body.cost) return res.status(400).json({
        error: 'Bad Request',
        message: 'No cost value provided'
    });

    try {
        // Update the item and return the new one. Populate names of assigned and requesting users
        let item = await ItemModel.findOneAndUpdate({_id: req.params.id, event: req.params.event, assigned: undefined}, {assigned: req.userID, cost: req.body.cost}, {runValidators: true, new: true})
            .populate('requested', '_id name').populate('assigned', '_id name').exec();
        if(!item){
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Item not found or already assigned to someone else.'
            });
        }
        res.status(200).json({message: `Updated 1 item.`});
        //send notification if someone else's item was assigned
        if(item.requested._id.toString() !== req.userID)
            emitNotification(item.event.toString(), `Your request of '${item.name}' was assigned!`, "item", item.requested._id)
                .catch(e => console.error(e));
        //send real-time update
        socket.editItem(req.params.event, item);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error
        });
    }
};

/**
 * Unassigns an item from the user and sends real-time update
 */
const unassign = async (req, res) => {
    try {
        // Update the item and return the new one. Populate names of assigned and requesting users
        let item = await ItemModel.findOneAndUpdate({_id: req.params.id, event: req.params.event, assigned: req.userID}, {assigned: undefined, cost: undefined}, {runValidators: true, new: true, omitUndefined: true})
            .populate('requested', '_id name').populate('assigned', '_id name').exec();
        if(!item){
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Item not found or not assigned to you.'
            });
        }
        res.status(200).json({message: `Updated 1 item.`});
        //send notification if someone else's item was assigned
        if(item.requested._id.toString() !== req.userID)
            emitNotification(item.event.toString(), `Your request of '${item.name}' is no longer assigned to someone.`, "item", item.requested._id)
                .catch(e => console.error(e));
        //send real-time update
        socket.editItem(req.params.event, item);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error
        });
    }
};

/**
 * Removes an item from the event and sends real-time update
 */
const remove = async (req, res) => {
    let item;
    try {
        // Item has to be retreived first to check if it was already assigned (in this case it can only be deleted by a host)
        item = await ItemModel.findOne({ _id: req.params.id, event: req.params.event }).exec();
        if (!item) {
            return res.status(404).json({
                error: 'Not found',
                message: 'Item not found'
            });
        }
    } catch (error) {
        return res.status(404).json({
            error: 'Not found',
            message: 'Item not found'
        });
    }
    if (!req.inv.asHost && (item.requested.toString() !== req.userID)) return res.status(403).json({
        error: 'Forbidden',
        message: 'Only hosts can delete items of other members'
    });


    try {
        await item.remove();
        res.status(200).json({message: `Deleted 1 item.`});
        // Send notifications if the item was assigned or requested by someone else
        if(item.requested.toString() !== req.userID){
            emitNotification(item.event.toString(), `Your request of '${item.name}' was deleted`, "item", item.requested)
                .catch(e => console.error(e));
        }
        else if(item.assigned && (item.assigned.toString() !== req.userID)){
            emitNotification(item.event.toString(), `Your assignment of '${item.name}' was deleted`, "item", item.assigned)
                .catch(e => console.error(e));
        }
        //send real-time update
        socket.deleteItem(req.params.event, req.params.id);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

const listCategories = (req, res) => {
    res.status(200).json(categories);
};

/**
 * List all items of an event
 */
const list  = (req, res) => {
    ItemModel.find({event: req.params.event})
    .populate('requested', '_id name').populate('assigned', '_id name').exec()
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

/**
 * Read one item of an event
 */
const read  = (req, res) => {
    ItemModel.findOne({_id: req.params.id, event: req.params.event}).populate('requested', '_id name').populate('assigned', '_id name').exec()
        .then(item => res.status(200).json(item))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

module.exports = {
    create,
    edit,
    assign,
    unassign,
    read,
    remove,
    list,
    listCategories
};