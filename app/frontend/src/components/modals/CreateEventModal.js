"use strict";

import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { EventTypes } from '../EventCard';
import { Formik } from 'formik';
import * as yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { Datepicker } from 'react-formik-ui';

const eventTypes = Object.keys(EventTypes);

const schema = yup.object({
    name: yup.string().required("Please enter the name of your Event.").max(50, "Event name too long."),
    time: yup.string().required("Please select date and time"),
    location: yup.string().required("Please enter a location for your Event.")
});

/**
 * This modal allows the user to create an event.
 */
class CreateEventModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date()
        }
        this.roundMinutes = this.roundMinutes.bind(this);
    }

    getInitialState() {
        var value = new Date().toISOString();
        return {
            value: value
        }
    }

    // round the time to the next nearest full hour
    roundMinutes(date) {
        const d = new Date(date);
        d.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
        d.setMinutes(0);
        return d;
    }

    render() {
        return (<Modal
            {...this.props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {"Create Event"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Formik
                    validationSchema={schema}
                    onSubmit={this.props.onSubmit}
                    initialValues={{
                        name: '',
                        time: this.roundMinutes(new Date()),
                        location: '',
                        type: eventTypes[0]
                    }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                    }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId="validationFormik01">
                                    <Form.Label>Event name</Form.Label>
                                    <Form.Control
                                        placeholder="Event name"
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validationFormik02">
                                    <Form.Label>Select Date and Time</Form.Label>
                                    <Datepicker id="datepicker"
                                        name='time'
                                        showTimeSelect
                                        dateFormat="yyyy/MM/dd hh:mm aa"
                                        timeFormat='HH:mm'
                                        timeCaption="time"
                                        className="form-control"
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.time}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validationFormik03">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        placeholder="Location"
                                        type="text"
                                        name="location"
                                        value={values.location}
                                        onChange={handleChange}
                                        isInvalid={!!errors.location}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validationFormik04">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        as="select"
                                        name="type"
                                        value={values.type}
                                        onChange={handleChange}
                                    >
                                        {eventTypes.map((el, i) => (<option key={i} value={el}>{el}</option>))}
                                    </Form.Control>
                                </Form.Group>
                                <hr />

                                <Button type="submit">{"Create Event"}</Button>
                            </Form>
                        )}
                </Formik>
            </Modal.Body>
        </Modal>);
    }
}

export default CreateEventModal;