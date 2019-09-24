"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const PictureController = require('../controllers/pictureController');

router.post('/', middlewares.checkAuthentication, PictureController.create); // Create a new profile picture


module.exports = router;