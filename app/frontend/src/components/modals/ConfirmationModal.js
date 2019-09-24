"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

/**
 * Basic modal asking the user for confirmation. Then executing props.onSubmit
 */
class ConfirmationModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <Modal
                {...this.props}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{this.props.children}</p>
                    <hr />
                    <Button variant="primary" onClick={this.props.onSubmit}>Confirm</Button>
                </Modal.Body>
            </Modal> 
        );
    }
}

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
};

export default ConfirmationModal;