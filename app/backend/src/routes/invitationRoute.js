"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const InvitationController = require('../controllers/invitationController');

router.post('/:event', middlewares.checkAuthentication, middlewares.checkMembership, InvitationController.create); // Create a new invitation
router.get('/:event', middlewares.checkAuthentication, middlewares.checkInvited, InvitationController.list); // List invitations of event
router.put('/:event/:status', middlewares.checkAuthentication, InvitationController.update); // Edit the status of invitation

module.exports = router;