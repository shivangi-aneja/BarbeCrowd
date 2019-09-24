"use strict";

import React from 'react';
import { withRouter } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Search from './Search';
import UserService from  '../services/UserService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import { NotificationDropdown } from './NotificationDropdown';
import NotificationService from '../services/NotificationService';

/**
 *  Header for the application
 */
class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined,
    }

    this.logout = this.logout.bind(this);
  }

  logout() {
    UserService.logout();
    this.state = {
        user: UserService.isAuthenticated() ? UserService.getCurrentUser() : undefined
    };
    if(this.props.location.pathname != '/login') {
        this.props.history.push('/login');
    }
    else {
        window.location.reload();
    }
  }

    render() {
      return (
          <Navbar collapseOnSelect expand="lg" bg="wood" variant="dark" sticky="top" style={{"backgroundColor": "#000000"}}>
            <Navbar.Brand href="#">{}<img src={require('../img/logo.png')} height="40" width="150" className="d-inline-block align-top"/></Navbar.Brand>

            { this.props.search && <Search onFilterChange={this.props.onFilterChange} /> /*Search should not be displayed everywhere*/}

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">

              <Nav className="mr-auto">
                  <Nav.Link href="#features"></Nav.Link>
                  <Nav.Link href="#pricing"></Nav.Link>
              </Nav>

              {this.state.user? //Notifications and User is only displayed when signed in
              <Nav>

                {/* Dropdown displaying user's notifications */}
                <NotificationDropdown icon={faBell} header="Notifications" 
                  loadData={() => NotificationService.getNotifications(false)} 
                  countData={() => NotificationService.countNotifications(false)} 
                />

                {/* Dropdown displaying user's messages (invitations) */}
                <NotificationDropdown icon={faEnvelope} header="Messages" 
                  loadData={() => NotificationService.getNotifications(true)} 
                  countData={() => NotificationService.countNotifications(true)} 
                />

                <Nav.Link className="vertical-divider" eventKey="disabled" disabled></Nav.Link>

                {/* Profile dropdown */}
                <NavDropdown id="dropdown-menu-align-right" alignRight title={
                  <div className="pull-left contrast">
                    {this.state.user.name}
                    <img className="img-profile rounded-circle" src={UserService.getProfilePicture()} height="40" width="40" style={{objectFit: "cover" }}/>
                  </div>} >
                  <NavDropdown.Item href="#me">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => this.logout()}><FontAwesomeIcon style={{marginRight: '5px'}} icon={faSignOutAlt} />Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              : //Else show sign in link
              <Nav>
                <Nav.Link className="contrast bold" onClick={() => this.props.history.push('/login')} style={{fontSize:20, fontFamily:"Gill Sans"}}>Sign In</Nav.Link>
              </Nav>
              }

            </Navbar.Collapse>
          </Navbar>
        );
    }


};

export default withRouter(Header);