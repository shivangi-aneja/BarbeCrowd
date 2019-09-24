"use strict";

const UserModel = require('../models/userModel');
const NotificationController = require('./notificationController');
const InvitationModel = require('../models/invitationModel');
const socket = require('../routes/socket');

/**
 * This method is used to create an invitation in the database
 * @param req
 * @param res
 * @returns String with message (whether its success or failure).
 */
const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });
    if(!req.inv.asHost) return res.status(403).json({
        error: 'Forbidden',
        message: 'Only hosts can send invitations'
    });
    let id;
    // Find the user object of the email
    UserModel.findOne({email: req.body.to_email}).exec()
        // Count existing invitations of this user to the event
        .then(to_user => {
            id = to_user._id;
            return InvitationModel.count({to: id, event: req.params.event}).exec();
        // If the user wasn't already invited: create the new Invitation
        }).then(count => {
            if(count > 0){
                return res.status(403).json({
                    error: 'Forbidden',
                    message: 'User was already Invited'
                });
            }
            const invitation = {
                from: req.userID,
                to: id,
                event: req.params.event,
                asHost: req.body.asHost,
                status: "pending"
            };
            return InvitationModel.create(invitation);
        // Send a Notification to the invited User
        }).then(invitation => {
            NotificationController.emitNotification(invitation.event, req.body.message, 'inv', invitation.to);
            res.status(200).json({ message: `Invitation created` });
            return invitation.populate('to', '_id name').execPopulate();
        // Send the real-time update
        }).then(invitation => {
            socket.addInvitation(req.params.event, invitation);
        })
        .catch(error => res.status(500).json({
            error: 'Create Invitation: Internal server error',
            message: error.message
    }));
};

/**
 * This method is used to list invitations
 * @param req
 * @param res
 */
const list  = (req, res) => {
    InvitationModel.find({event: req.params.event}).populate('to', '_id name').exec()
        .then(items => res.status(200).json(items))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};

/**
 * This method is used to update the status of invitation (accept/reject) in the database
 * @param req
 * @param res
 */
const update = (req, res) => {
    if(req.params.status==="pending")
        return res.status(200).json({ message: `Updated the invitation` });
    InvitationModel.findOneAndUpdate({event: req.params.event, to: req.userID, status:"pending"},
        {status: req.params.status}, { runValidators: true, new: true }).populate('to', '_id name').exec()
    .then(invite => {
        res.status(200).json({ message: `Updated the invitation` });
        socket.editInvitation(req.params.event, invite);
        if(req.params.status === 'accepted')
            return NotificationController.emitNotificationToEvent(req.params.event, `${invite.to.name} just joined the event!`,'join',req.userID);
    })
    .catch(error => res.status(500).json({
        error: 'Internal server error',
        message: error.message
    }));
};

module.exports = {create, list, update};