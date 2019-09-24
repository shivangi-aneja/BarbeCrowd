"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Formik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';

const units = ["pcs.", "kg", "g", "l", "ml"];

const schema = yup.object({
    itemName: yup.string().required("Please enter the name of your item.").max(50, "Item name too long.").min(2, "Item name too short."),
    itemAmount: yup.number().required("Please enter the amount of your item request.").min(1, "Please enter a positive number.").max(9999, "Number too large."),
    unit: yup.string(),
    category: yup.string(),
  });

/**
 * Modal allowing users to create an item request, or edit it while it is still unassigned
 */
class SmallItemModal extends React.Component {

    constructor(props) {
        super(props);
    }

    getInitialValues(editing){
        if(editing) {
            const amountUnit = this.props.row.amount? this.props.row.amount.split(" ") : [""];
            return {
                itemName: this.props.row.name,
                itemAmount: amountUnit[0],
                unit: amountUnit[1]? amountUnit[1] : '',
                category: this.props.row.category
            };
        } else {
            return {
                itemName: '',
                itemAmount: '',
                unit: '-',
                category: 'Beverages'
            };
        }
    }

render() {    
    // if the row already contains elements, the item is edited instead
    const editing = !!Object.keys(this.props.row).length;
    return ( <Modal
            {...this.props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {`${editing? 'Edit' : 'Add'} Item`}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.props.onSubmit}
                    initialValues={this.getInitialValues(editing)}
                >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="validationFormik01">
                            <Form.Label>Item name</Form.Label>
                            <Form.Control
                                placeholder="Item name"
                                type="text"
                                name="itemName"
                                value={values.itemName}
                                onChange={handleChange}
                                isInvalid={!!errors.itemName}
                            />
                            <Form.Control.Feedback type="invalid">{errors.itemName}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} md="8" controlId="validationFormik02">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Item amount"
                                    name="itemAmount"
                                    value={values.itemAmount}
                                    onChange={handleChange}
                                    isInvalid={!!errors.itemAmount}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.itemAmount}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationFormik03">
                                <Form.Label>Unit</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    as="select" 
                                    name="unit" 
                                    value={values.unit} 
                                    onChange={handleChange} 
                                    isInvalid={!!errors.unit}
                                >
                                    <option>-</option>
                                    {units.map((el, i) => (<option key={i} value={el}>{el}</option>) )} 
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.unit}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="validationFormik05">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                as="select"
                                name="category"
                                value={values.category}
                                onChange={handleChange}
                                isInvalid={!!errors.category}
                            >
                                {this.props.categories.map((el, i) => (<option key={i} value={el}>{el}</option>) )} 
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                        </Form.Group>
                        <hr />
                        <Button type="submit">{`${editing? 'Edit' : 'Add'} Item`}</Button>
                    </Form>
                )}
                </Formik>
            </Modal.Body>
        </Modal> );
    }
}

SmallItemModal.propTypes = {
    row: PropTypes.object.isRequired,           // the table row of the item to be edited
    categories: PropTypes.array.isRequired,     // item categories
    users: PropTypes.array.isRequired           // users currently in the event
};

export default SmallItemModal;