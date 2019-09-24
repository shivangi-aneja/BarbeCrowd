"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Formik } from 'formik';
import * as yup from 'yup';

const roles = ["Host", "Guest"];

const schema = yup.object({
    email: yup.string().required("Please enter the email address."),
    message: yup.string().required("Please enter the Message.").max(255, "Message too long."),
    role: yup.string(),
});

/**
 *  This modal allows prompts the user to fill in the details of the guests to be invited
 */
class InvitationModal extends React.Component {

    constructor(props) {
        super(props);
    }

    getInitialValues(){
        return {
            email: '',
            message: '',
            role: 'Guest'
        };
    }



    render() {

        return ( <Modal
            {...this.props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Invite Guest
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.props.onSubmit}
                    initialValues={this.getInitialValues()}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          errors,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit}>

                            <Form.Group controlId="validationFormik01">
                                <Form.Label>Email Id</Form.Label>
                                <Form.Control
                                    placeholder="Email Id"
                                    type="text"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="validationFormik01">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    placeholder="Message"
                                    type="text"
                                    name="message"
                                    value={values.message}
                                    onChange={handleChange}
                                    isInvalid={!!errors.message}
                                />
                                <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group controlId="validationFormik03">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    type="text"
                                    as="select"
                                    name="role"
                                    value={values.role}
                                    onChange={handleChange}
                                    isInvalid={!!errors.role}
                                >

                                    {roles.map((el, i) => (<option key={i} value={el}>{el}</option>) )}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.role}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <hr />
                            <Button type="submit">Send Invite</Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal> );
    }
}

export default InvitationModal;
