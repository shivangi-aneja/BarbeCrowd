"use strict";

const NotificationModel = require('../models/notificationModel');
const InvitationModel = require('../models/invitationModel');

/**
 * creates a Notification for the specified user
 * @param {object} event the _id of the event
 * @param {object} message the notification message
 * @param {object} type the type of the notification
 * @param {object} userID the _id of the receiving user
 */
const emitNotification = async (event, message, type, userID) => {
    const isMessage = (type === "inv" || type === "msg");
    try {
        await NotificationModel.create({ type, isMessage, event, message, userID });
    } catch(error) {
        console.error(error);
    }
}

/**
 * creates Notifications for all members of an event except the user sending the notifications
 * @param {object} event the _id of the event
 * @param {object} message the notification message
 * @param {object} type the type of the notification
 * @param {object} senderID the _id of the sending user who is not receiving the notification
 */
const emitNotificationToEvent = async (event, message, type, senderID) => {
    const isMessage = (type === "inv" || type === "msg");
    try {
        // Find all members of Event except sender by selecting 'to' field of accepted invitations
        const members = await InvitationModel.find({event: event, status: 'accepted', to: {$ne: senderID}}, 'to').exec();
        // Create the notifications
        const notifications = members.map(member => { return {
            type, isMessage, event, message, userID: member.to
        }});
        await NotificationModel.create(notifications);
    } catch(error) {
        console.error(error);
    }
}

/**
 * Mark one of the user's notifications as read
 */
const read = (req, res) => {
    NotificationModel.update(
        { userID: req.userID, _id: req.params.id },
        { $set:
            { isRead: true }
        }
    ).exec()
    .then(ret => ret.n>0? res.status(200).json(ret) : res.status(400).json({
        error: 'Bad Request',
        message: 'Notification not found'
    }))
    .catch(error => res.status(500).json({
        error: 'Internal server error',
        message: error.message
    }));
};

/**
 * Remove all of the user's notifications with ids specified in the body
 */
const remove = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const toDelete = req.body.ids;
    NotificationModel.deleteMany({userID: req.userID, _id: {$in: toDelete}})
        .then(ret => res.status(200).json({message: `Deleted ${ret.n} notifications.`}))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
    }));
};

/**
 * List all notifications of the user
 */
const list = (messages) => (req, res) => {
    // Find all Notifications and populate the event name. Sorting by _id is equivalent to sorting by the creation date
    NotificationModel.find({userID: req.userID, isMessage: messages}, null, {sort: '-_id'}).populate('event', '_id name').exec()
        .then(notifications => res.status(200).json(notifications))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
    }));
};

/**
 * Count all unread Notifications
 * @param {boolean} messages defines if messages or updates should be counted
 * @returns the request handler
 */
const count = (messages) => (req, res) => {
    NotificationModel.count({userID: req.userID, isMessage: messages, isRead: false}).exec()
        .then(count => res.status(200).json({count}))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
    }));
};

module.exports = {
    read,
    remove,
    list,
    count,
    emitNotification,
    emitNotificationToEvent
};