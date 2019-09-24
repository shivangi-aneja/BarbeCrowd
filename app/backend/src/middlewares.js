"use strict";

const jwt    = require('jsonwebtoken');
const InvitationModel = require('./models/invitationModel');
const config = require ('./config');

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};


const checkAuthentication = (req, res, next) => {

    // check header or url parameters or post parameters for token
    let token = ""
    if (req.headers.authorization) {
        token = req.headers.authorization.substring(4);
    }

    if (!token)
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'No token provided in the request'
        });

    // verifies secret and checks exp
    jwt.verify(token, config.JwtSecret, (err, decoded) => {
        if (err) return res.status(401).send({
            error: 'Unauthorized',
            message: 'Failed to authenticate token.'
        });

        // if everything is good, save to request for use in other routes
        req.userID = decoded._id;
        next();
    });


};

/**
 * checks if user is member of the event specified in req.params. If yes, sets req.inv to the user's accepted invitation to the event
 */
const checkMembership = (req, res, next) => {
    InvitationModel.findOne({ to: req.userID, event: req.params.event, status: 'accepted' }).exec()
        .then(invitation => {
            if (!invitation) res.status(403).send({
                error: 'Forbidden',
                message: 'User not member of event'
            });
            else {
                req.inv = invitation;
                next();
            }
        })
        .catch(error => res.status(500).send({
            error: 'Internal Server Error',
            message: error
        }));
}


/**
 * checks if user is invited to the event specified in req.params. If yes, sets req.inv to the user's invitation to the event
 */
const checkInvited = (req, res, next) => {
    InvitationModel.findOne({ to: req.userID, event: req.params.event, 
        $or: [
        { status: 'accepted' },
        { status: 'pending' }
      ]}).exec()
        .then(invitation => {
            if (!invitation) res.status(403).send({
                error: 'Forbidden',
                message: 'User not invited to event'
            });
            else {
                req.inv = invitation;
                next();
            }
        })
        .catch(error => res.status(500).send({
            error: 'Internal Server Error',
            message: error
        }));
}

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.sendStatus(500);
    res.render('error', { error: err })
};


module.exports = {
    allowCrossDomain,
    checkAuthentication,
    checkMembership,
    checkInvited,
    errorHandler
};