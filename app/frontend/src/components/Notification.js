"use strict";

import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faFireAlt, faCalendarAlt, faUserPlus, faCartArrowDown, faTimes} from "@fortawesome/free-solid-svg-icons";
import NavDropdown from 'react-bootstrap/NavDropdown';
import PropTypes from 'prop-types';

const Type = {
    reminder  : {bg: "pink", icon: faCalendarAlt},
    item      : {bg: "yellow", icon: faCartArrowDown},
    join      : {bg: "lightgreen", icon: faUserPlus},
    inv       : {bg: "lightblue", icon: faFireAlt},
    msg       : {bg: "orange", icon: faEnvelopeOpenText}
};

class Notification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isHovering: false, // keeping track of hover state to render delete button conditionally
        };

        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
        this.getTimePassed = this.getTimePassed.bind(this);
    }
    
    handleMouseHover() {
        this.setState(this.toggleHoverState);
    }
    
    toggleHoverState(state) {
        return {
          isHovering: !state.isHovering,
        };
    }

    // delete button 'x' on single notification was pressed
    deleteNotification(e) {
        e = e? e : window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        this.props.onDelete(this.props.index);
    }

    /**
     * returns the time passed since creation of the notification as a formatted string
     */
    getTimePassed() {
        let createdAt = new Date(parseInt(this.props._id.slice(0,8), 16)*1000);
        let now = new Date();
        let diffMs = (now - createdAt); // milliseconds between now & createdAt
        let diffMins = Math.floor(diffMs  / 60000); // minutes
        if(diffMins < 1)
            return "just now";
        if(diffMins == 1)
            return "1 min";
        let diffHrs = Math.floor(diffMins / 60); // hours
        if(diffHrs < 1)
            return `${diffMins} mins`;
        if(diffHrs == 1)
            return `1 hr`;
        let diffDays = Math.floor(diffHrs / 24); // days
        if(diffDays < 1)
            return `${diffHrs} hrs`;
        if(diffDays == 1)
            return `1 day`;
        let diffWeeks = Math.floor(diffDays / 7);
        if(diffWeeks < 1)
            return `${diffDays} days`;
        if(diffWeeks == 1)
            return `1 week`;
        return `${diffWeeks} weeks`;
    }

    render() {
        // Notifications gray out if read
        const bg = this.props.isRead? "lightgray" : Type[this.props.type]["bg"];
        return (
            <NavDropdown.Item className="d-flex align-items-center"
                    onClick={() => this.props.onRead(this.props.index)} 
                    onMouseEnter={this.handleMouseHover}
                    onMouseLeave={this.handleMouseHover}>

                <div className="mr-3">
                    <div className="icon-circle" style={{backgroundColor: bg}}>
                        <FontAwesomeIcon className={`fa-2x${this.props.isRead? " isRead" : ""}`} icon={Type[this.props.type]["icon"]} />
                    </div>
                </div>
                <div style={{width: "100%"}}>
                    <div className={`d-flex justify-content-between small text-gray-${this.props.isRead? "600":"900"}`}>
                        <div>{this.props.event.name}</div><div>{this.getTimePassed()}</div>
                    </div>
                    <div className={`d-flex justify-content-between font-weight-bold text-gray-${this.props.isRead? "600":"1000"}`}>
                        <div style={{width: "93%", wordBreak: "break-word", whiteSpace: "normal"}}>{this.props.message}</div>
                        { this.state.isHovering && <div className='tooltipicon' onClick={this.deleteNotification} style={{padding: '0px 4px', borderRadius: '6px'}}>
                            <FontAwesomeIcon icon={faTimes} /></div> }
                    </div>
                </div>

            </NavDropdown.Item>
        );
    }
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    event: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

export default Notification;