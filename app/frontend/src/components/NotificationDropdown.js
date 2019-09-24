"use strict";

import React from 'react';
import { withRouter } from 'react-router-dom'

import NavDropdown from 'react-bootstrap/NavDropdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Notification from './Notification';
import NotificationService from '../services/NotificationService';
import PropTypes from 'prop-types';

class NotificationDropdownMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            count: 0,
            data: []
        }

        this.loadData = this.loadData.bind(this);
        this.clearNotifications = this.clearNotifications.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.deleteNotification = this.deleteNotification.bind(this);
        this.count = this.count.bind(this);
    }

    /**
     * number of unread notifications is polled initially after 100ms then every 3sec
     */
    componentWillMount(){
        this.timeout = setTimeout(() => {
            this.count();
        }, 100);
        this.interval = setInterval(() => {
            this.count();
        }, 3000);
    }

    // prevent state change on unmounted component
    componentWillUnmount(){
        if(this.interval)
            clearInterval(this.interval);
        if(this.timeout)
            clearTimeout(this.timeout);
    }

    // call countData() function and update badge number
    count() {
        this.props.countData().then(count => {
            this.setState(Object.assign({}, this.state, count));
        }).catch(error => {
            console.log(error);
        });
    }

    // call loadData() function and update Notification children
    loadData() {
        if(!this.state.open) return;
        this.props.loadData().then(data => {
            this.setState(Object.assign({}, this.state, {data, count: data.filter(el => !el.isRead).length}));
        }).catch(error => {
            console.error(error);
        });
    }

    // called if user clicks notification. Links to the event and marks Notification as read
    readNotification(index) {
        const notification = this.state.data[index];
        this.props.history.push(`/events/${notification.event._id}`);
        window.location.reload();
        if(notification.isRead)
          return;
        this.state.data[index].isRead=true;
        NotificationService.readNotification(this.state.data[index]).catch((console.error));
    }
    
    // delete a single notification and update badge count
    deleteNotification(index) {
        if(index<0||index>=this.state.data.length)
            return;
        NotificationService.deleteNotifications([this.state.data[index]]).catch(console.error);
        const wasRead = this.state.data[index].isRead;
        this.state.data.splice(index, 1)
        this.setState(Object.assign({}, this.state, {data: [...this.state.data], 
            count: wasRead?this.state.count:(this.state.count-1)}));
    }
    
    // delete all notifications
    clearNotifications() {
        if(!this.state.data)
            return;
        NotificationService.deleteNotifications(this.state.data).catch((e) => {
            console.error(e);
        });
        this.setState(Object.assign({}, this.state, {data: [], count: 0, open: false}));
    }

    render() {
        const icon = {
            fontSize: '20px',
            color: 'white',
            position: 'relative',
            top: '10px',
        };

        const badge = {
            position: 'relative',
            bottom: '4px',
            right: '7px',
        };

        //NavDropdown is rendered as an icon or as text depending on whether the Navbar is collapsed or not (desktop vs mobile)
        return (
            <NavDropdown className="notification-menu navIcon shadow animated--grow-in" id="dropdown-menu-align-right" alignRight  onToggle={() => {this.state.open= !this.state.open;}} onClick={this.loadData} title={
                <div>
                    <div className="desktop">
                        <FontAwesomeIcon  style={icon} icon={this.props.icon} />
                        {this.state.count > 0 && <span style={badge} className="badge badge-danger badge-counter">{this.state.count}</span>}
                    </div>
                    <div className="mobile" style={{width: "100px"}}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>{this.props.header}</div>
                            {this.state.count > 0 && <span className="badge badge-danger badge-counter">{this.state.count}</span>}
                        </div>
                    </div>
                </div>} >
                <NavDropdown.Header className="text-gray-900 font-weight-bold" style={{fontSize: '16px'}}>{this.props.header}</NavDropdown.Header>
                <div className="dropdown-items notification-items">
                    {this.state.data.map((el, i) => (<Notification key={i} index={i} {...el} onRead={this.readNotification} onDelete={this.deleteNotification}/>) )}
                </div>
                <NavDropdown.Item className="text-gray-900 font-weight-bold" style={{fontSize: '14px', textAlign: "center"}} onClick={this.clearNotifications}>Delete All</NavDropdown.Item>
            </NavDropdown>
        );
    }
}

NotificationDropdownMenu.propTypes = {
    header: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired
};

export const NotificationDropdown = withRouter(NotificationDropdownMenu);