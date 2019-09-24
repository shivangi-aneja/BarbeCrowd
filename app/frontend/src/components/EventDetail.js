"use strict";

import React from 'react';
import EventService from "../services/EventService";

/**
 *  Event detail view displaying all the information about the event (party).
 */
class EventDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentWillMount() {
        // get event data from database and set state
        EventService.getEvent(this.props.eventID).then((data) => {
            this.setState(Object.assign({}, this.state, { data: data }));
        }).catch((e) => {
            this.setState(Object.assign({}, this.state, {}));
            console.error(e);
        });
    }


    render() {

        return (
            <div>
                <div id="eventname" className="center eventTableRow text-white text-uppercase">{this.state.data.name}</div>
                <p className="center eventTableRow text-white" >on {new Date(this.state.data.time).toDateString()}</p>
                <p className="center eventTableRow text-white">at {new Date(this.state.data.time).getHours() + ':' + (new Date(this.state.data.time).getMinutes() < 10 ? '0' : '') + new Date(this.state.data.time).getMinutes() + ' (' + /\((.*)\)/.exec(new Date().toString())[1] + ')'}</p>
                <p className="center eventTableRow text-white">in {this.state.data.location}</p>
            </div>
        );
    }
}

export default EventDetail;