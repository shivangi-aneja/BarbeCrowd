"use strict";

import React from 'react';
import Page from '../components/Page';
import { EventCard } from '../components/EventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import CreateEventModal from '../components/modals/CreateEventModal';
import EventService from '../services/EventService';

export class HomeView extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      createEventModalShow: false,
      data: [],
      filter: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.compare = this.compare.bind(this);

  }

  /**
   * Compares two Dates a and b and returns false if a < b, true otherwise.
   * This function is used to order the events by their date
   * @param {Date} a
   * @param {Date} b
   */
  compare(a, b) {
    if (new Date(a.time) < new Date(b.time)) {
      return -1;
    }
    if (new Date(a.time) > new Date(b.time)) {
      return 1;
    }
    return 0;
  }

  // this method is called before the render method. All events are fetched from the database
  componentWillMount() {

    // get all events from the database and set state. Order the events by date
    EventService.getEvents().then((data) => {
      this.setState(Object.assign({}, this.state, { loading: false, data: data.sort(this.compare) }));
    }).catch((e) => {
      this.setState(Object.assign({}, this.state, { loading: false }));
      console.error(e);
    });
  }

  // onSumbit, save event in the database. This method is triggered by the child component (CreateEventModal)
  handleSubmit(event) {
    const eventDate = new Date(event.date);

    if (!event.name) return;
    EventService.createEvent(event).then((res) => {
      let data = [...this.state.data];
      data.push(res);
      this.setState(Object.assign({}, this.state, { createEventModalShow: false, data: data.sort(this.compare) }));
      return res;
    }).catch((e) => {
      this.setState(Object.assign({}, this.state, { createEventModalShow: false }));
      window.confirm(e);
    });
  }

  // return true if event is in the past, false otherwise
  isInThePast(event) {
    const now = new Date();
    if (new Date(event.time).getTime() < now.getTime()) {
      return true;
    }
    return false;
  }

  onFilterChange(value) {
    this.setState(Object.assign({}, this.state, { filter: value }));
  }

  isFiltered(e) {
    return (e.name.toLowerCase().includes(this.state.filter)) || (e.type.toLowerCase() === this.state.filter)
  }

  render() {

    const createEventModalClose = () => this.setState(Object.assign({}, this.state, { createEventModalShow: false }));

    return (
      <Page search onFilterChange={this.onFilterChange}>
        <div className="container-fluid">
          <div style={{ height: "20px" }}></div>
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-200">Upcoming Events</h1>
          </div>

          <div className="row">

            {this.state.data.filter(e => !this.isInThePast(e) && this.isFiltered(e)).map((el, i) => (<EventCard key={i} {...el} />))}

          </div>

          <div className="d-sm-flex align-items-center justify-content-between mb-4 aligh-left">
            <h1 className="h3 mb-0 text-gray-800"></h1>
            <Button onClick={() => this.setState(Object.assign({}, this.state, { createEventModalShow: true }))} variant="primary"><FontAwesomeIcon className="text-white-50" style={{ marginRight: "8px" }} icon={faPlus} /> Create Event</Button>
          </div>

          <div className="mb-4 py-3 bord"></div>

          <div className="d-sm-flex align-items-center justify-content-between mb-4 aligh-left">
            <h1 className="h3 mb-0 text-gray-200"> Past Events</h1>
          </div>

          <div className="row">

            {this.state.data.filter(e => this.isInThePast(e) && this.isFiltered(e)).map((el, i) => (<EventCard key={i} {...el} />))}

          </div>

          <CreateEventModal
            show={this.state.createEventModalShow}
            onHide={createEventModalClose}
            onSubmit={this.handleSubmit}
          />

        </div>

      </Page>
    );
  }
}
