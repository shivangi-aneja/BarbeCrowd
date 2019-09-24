"use strict";
const config  = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const middlewares = require('./middlewares');
const auth  = require('./routes/authRoute');
const notification = require('./routes/notificationRoute');
const invitation = require('./routes/invitationRoute');
const item = require('./routes/itemRoute');
const category = require('./routes/categoryRoute');
const chat = require('./routes/chatRoute');
const event = require('./routes/eventRoute');
const picture = require('./routes/pictureRoute');

const api = express();


// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(fileUpload({
    limits: { fileSize: 1 * 1024 * 1024, fields: 0, files: 1 },
  }));
api.use(middlewares.allowCrossDomain);
api.use(cors());


// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Barbecrowd Backend'
    });
});

let server = require('http').createServer(api).listen(parseInt(config.socketPort), () => {
    console.log(`Socket.io is running in port ${config.socketPort}`);
});
require('./routes/socket.js').initialize(server);

// API routes
api.use('/auth', auth);
api.use('/notifications', notification);
api.use('/invitations', invitation);
api.use('/items', item);
api.use('/categories', category);
api.use('/chat', chat);
api.use('/events', event);
api.use('/picture', picture);

// Profile picture route
api.use('/', express.static('public'));
api.use('/', function (req, res, next) { // Default route to default picture
    res.sendFile(path.resolve(__dirname + '/../public/profile/default.png'));
});


module.exports = api;