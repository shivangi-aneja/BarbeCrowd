"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const ItemController = require('../controllers/itemController');

router.post('/:event', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.create); // Create a new item
router.get('/:event', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.list); // List all items in event
router.get('/:event/:id', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.read); // Get an item
router.delete('/:event/:id', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.remove); // Delete an item by Id

router.put('/:event/:id', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.edit); // Edit an item by Id
router.put('/:event/:id/assign', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.assign); // Assign user to an item by Id
router.put('/:event/:id/unassign', middlewares.checkAuthentication, middlewares.checkMembership, ItemController.unassign); // Unassign user from an item by Id


module.exports = router;