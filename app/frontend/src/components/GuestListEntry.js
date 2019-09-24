"use strict";

import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import PropTypes from 'prop-types';
import UserService from '../services/UserService';
import Badge from 'react-bootstrap/Badge';

const colors = {
    accepted: "success",
    pending: "warning",
    rejected: "danger"
};

/**
 * Single entry of the guestlist representing the visualization of an invitation
 */
class GuestListEntry extends React.Component {

    constructor(props) {
        super(props);
    }

    capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    render() {

        return (
            <Dropdown.Item className="d-flex align-items-center">
                <div className="mr-3"> {/* Profile picture */}
                    <img className="img-profile rounded-circle" src={UserService.getProfilePictureOfUser(this.props.to)} 
                        height="30" width="30" style={{objectFit: "cover", marginLeft: "-8px"}}/>
                </div>
                <div style={{width: "100%"}}> 
                    {/* The user's role in the event */}
                    <div className={`small text-gray-900`}> 
                        {this.props.asHost?"Host":"Guest"}
                    </div>
                    {/* The user's name */}
                    <div className={`font-weight-bold text-gray-1000"`} style={{fontSize: "14px", width: "93%", wordBreak: "break-word", whiteSpace: "normal"}}>
                        {this.props.to.name}
                    </div>
                </div>
                {/* Invitation is accepted/pending/rejected */}
                <h6 style={{margin: "auto"}}><Badge variant={colors[this.props.status]}>{this.capitalize(this.props.status)}</Badge></h6>
            </Dropdown.Item>
        );
    }
}

GuestListEntry.propTypes = {
    status: PropTypes.string.isRequired,
    asHost: PropTypes.bool.isRequired,
    to: PropTypes.object.isRequired
};

export default GuestListEntry;