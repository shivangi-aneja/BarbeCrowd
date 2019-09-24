"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const ItemController = require('../controllers/itemController');

router.get('/', middlewares.checkAuthentication, ItemController.listCategories); // List all item categories

module.exports = router;