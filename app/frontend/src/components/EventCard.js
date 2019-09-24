"use strict";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBeer, faDrumstickBite, faCarrot, faGlassCheers, faHamburger, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { SimpleLink } from './SimpleLink';
import PropTypes from 'prop-types';

const EventTypes = {
    party       : {color: "dark", icon: faBeer},
    standard    : {color: "warning", icon: faDrumstickBite},
    vegetarian  : {color: "success", icon: faCarrot},
    formal      : {color: "info", icon: faGlassCheers},
    vegan       : {color: "light", icon: faLeaf},
    burger      : {color: "primary", icon: faHamburger}
};

/**
 * Small card displaying name and day of an event. Displayed on homeview to create an overview.
 */
class EventCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const col = EventTypes[this.props.type]["color"];
        return (
            <div className="col-xl-3 col-md-6 mb-4">
                <SimpleLink to={`/events/${this.props._id}`}>
                    <div className={`card eventCard border-left-${col} border border-${col} shadow h-100 py-2`}>
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className={`text-xs font-weight-bold text-${col} text-uppercase mb-1`}> {new Date(this.props.time).toDateString()} </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-100"> {this.props.name} </div>
                                </div>
                                <div className="col-auto">
                                    <FontAwesomeIcon className="fa-2x text-gray-200" icon={EventTypes[this.props.type]["icon"]} />
                                </div>
                            </div>
                        </div>
                    </div>
                </SimpleLink>
            </div>
        );
    }
}

EventCard.propTypes = {
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export {EventCard, EventTypes};