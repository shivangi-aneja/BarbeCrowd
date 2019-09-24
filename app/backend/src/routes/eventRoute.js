"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const EventController = require('../controllers/eventController');

router.post('/', middlewares.checkAuthentication, EventController.create); // Create a new event
router.get('/', middlewares.checkAuthentication, EventController.list); // Get all events
router.get('/:event', middlewares.checkAuthentication, middlewares.checkInvited, EventController.getEvent); // Get specific event


module.exports = router;