"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Formik } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
    itemCost: yup.number().required("Please enter a positive number.").min(0, "Please enter a positive number.").max(9999, "Value too large."),
});

/**
 * Modal allows user to assign an item to themself. They declare their intention of bringing this item to the event 
 * and provide an estimated value of their contribution.
 */
class AssignItemModal extends React.Component {

    constructor(props) {
        super(props);
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
                    Assign Yourself
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Please enter the estimated total value you will contribute 
                    to the event by bringing this item. The requesting user will be notified.</p>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.props.onSubmit}
                    initialValues={{itemCost: ''}}
                >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>

                        <Form.Group controlId="validationFormik01">
                            <Form.Label>Cost (€)</Form.Label>
                            <Form.Control
                            placeholder="Estimated item cost (total)"
                            type="number"
                            name="itemCost"
                            value={values.itemCost}
                            onChange={handleChange}
                            isInvalid={!!errors.itemCost}
                            />
                            <Form.Control.Feedback type="invalid">{errors.itemCost}</Form.Control.Feedback>
                        </Form.Group>


                        <hr />
                        <Button type="submit">Confirm</Button>
                    </Form>
                )}
                </Formik>
            </Modal.Body>
        </Modal> );
    }
}

export default AssignItemModal;