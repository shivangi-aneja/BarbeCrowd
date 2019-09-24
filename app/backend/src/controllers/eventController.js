"use strict";

const EventModel = require('../models/eventModel');
const InvitationModel = require('../models/invitationModel');

/**
 * Save a NEW EVENT in the database using EventModel
 */
const create = (req, res) => {

    const event = req.body;

    // send a 400 if request body is empty
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'Can not send an empty message'
    });

    // send a 400 if parameters are empty or too long
    if (!event.name || event.name.length > 50 || !event.time || !event.location || event.location.length > 400 || !event.type || event.type.length > 50) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Corrupt event parameters'
        });
    }
    const eventDate = new Date(event.time);

    // send a 400 if time parameter is not a valid Date()
    if (Object.prototype.toString.call(eventDate) === "[object Date]") {
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'event.time is not valid'
            });
        }
    } else {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'event.time is not a Date()'
        });
    }

    // finally create an Event with the given parameters
    EventModel.create(req.body)
        .then(event => {
            // create an invitation object and set status=accepted for the event-creator
            const invitation = {
                from: req.userID,
                to: req.userID,
                event: event._id,
                asHost: true,
                status: "accepted"
            };
            // save the self-invitation for the event-creator
            InvitationModel.create(invitation)
                .then(inv => res.status(201).json(event))
                .catch(error => res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                }));
        })
        .catch(error => res.status(500).json({
            error: 'Create Event: Internal server error',
            message: error.message
        }));
};

/**
 * find ALL EVENTS saved in the database and check if the user accepted those events already
 * @param {object} req request
 * @param {object} res response
 */
const list = (req, res) => {
    InvitationModel.find({ to: req.userID, status: 'accepted' }).populate('event').exec()
        .then(invitations => res.status(200).json(invitations.map(inv => inv.event)))
        .catch(error => res.status(500).json({
            error: 'List Events: Internal server error',
            message: error.message
        }));
}


/**
 * find ONE EVENT by ID and send the whole event object
 * @param {object} req request
 * @param {object} res response
 */
const getEvent = (req, res) => {

    EventModel.findOne({ _id: req.params.event }).exec()
        .then(event => { res.status(200).json(event); })
        .catch(error => res.status(500).json({
            error: 'List Event: Internal server error',
            message: error.message
        }));
}

module.exports = {
    create,
    list,
    getEvent
};