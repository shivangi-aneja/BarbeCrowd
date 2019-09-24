"use strict";

import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends} from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import DropdownButton from 'react-bootstrap/DropdownButton'
import GuestListEntry from './GuestListEntry';

// order in which invitations should be displayed inside the guestlist
const order = {
    accepted: 1,
    pending: 2,
    rejected: 3
};

/**
 * Basic dropdown button displaying a list of all invitation and their status (accepted, pending, rejected)
 */
class GuestList extends React.Component {

    constructor(props) {
        super(props);
    }

    compare(a, b){
        return order[a.status]-order[b.status];
    }

    render() {

        return (
            <DropdownButton drop="up" variant="primary" className="navIcon shadow animated--grow-in" title={
                <div>Guest list <FontAwesomeIcon icon={faUserFriends} style={{marginLeft: '3px'}} /></div>} >
                <Dropdown.Header className="text-gray-900 font-weight-bold" style={{fontSize: '16px'}}>Guest list</Dropdown.Header>
                <div className="dropdown-items guest-items">
                    {this.props.guests.sort(this.compare).map((el, i) => (<GuestListEntry key={i} {...el}/>) )}
                </div>
            </DropdownButton>
        );
    }
}

GuestList.propTypes = {
    guests: PropTypes.array.isRequired
};

export default GuestList;