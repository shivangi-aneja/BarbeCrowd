"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const AuthController = require('../controllers/authController');
const ChatController = require('../controllers/chatController');

//sends a new message to the chat
router.post('/:event', middlewares.checkAuthentication, middlewares.checkMembership, ChatController.create);

//lists all messages
router.get('/:event', middlewares.checkAuthentication, middlewares.checkMembership, ChatController.list); // List all messages in event

module.exports = router;