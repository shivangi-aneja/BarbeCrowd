"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const NotificationController = require('../controllers/notificationController');

router.get('/updates', middlewares.checkAuthentication, NotificationController.list(false)); // List all updates
router.get('/messages', middlewares.checkAuthentication, NotificationController.list(true)); // List all messages
router.get('/updates/count', middlewares.checkAuthentication, NotificationController.count(false)); // Count all updates
router.get('/messages/count', middlewares.checkAuthentication, NotificationController.count(true)); // Count all messages
router.put('/:id', middlewares.checkAuthentication, NotificationController.read); // Mark a notifications as read by Id
router.delete('/', middlewares.checkAuthentication, NotificationController.remove); // Delete notifications by Id

module.exports = router;