"use strict";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import InvitationService from '../services/InvitationService';
import InvitationModal from "./modals/InvitationModal";
import Button from 'react-bootstrap/Button';
import GuestList from "../components/GuestList";

/**
 *  This component is reponsible for
 */
class InvitationSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addInvitationModalShow: false
        };
        this.sendInvite = this.sendInvite.bind(this);
    }

    sendInvite(invite) {
        if(!invite.email) return;

        const invitation = {
            to_email: invite.email,
            message: invite.message,
            asHost: (invite.role === 'Host'),
            status: 'pending'
        };
        InvitationService.createInvitation(invitation, this.props.eventID).catch(console.error);
        this.setState(Object.assign({}, this.state, {addInvitationModalShow: false}));
    }

    render() {
        const addInvitationModalClose = () => this.setState(Object.assign({}, this.state, {addInvitationModalShow: false}));

        return (
            <div>
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                    <GuestList guests={this.props.guests} />
                    {this.props.isHost && <Button onClick={() => this.setState(Object.assign({}, this.state, {addInvitationModalShow: true}))} variant="primary">
                        <FontAwesomeIcon className="text-white-50" style={{marginRight:"8px"}} icon={faPlus} /> Invite Guest</Button> }
                </div>
                {this.props.isHost && <InvitationModal
                    show={this.state.addInvitationModalShow}
                    onHide={addInvitationModalClose}
                    onSubmit={this.sendInvite}
                />}

            </div>
        );
    }
}

export default InvitationSection;