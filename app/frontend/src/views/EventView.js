"use strict";

import React from 'react';
import Page from '../components/Page';
import ItemTable from '../components/ItemTable';
import InvitationSection from '../components/InvitationSection'
import UserService from '../services/UserService';
import InvitationService from '../services/InvitationService';
import io from 'socket.io-client';
import EventDetail from '../components/EventDetail';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import Button from "react-bootstrap/Button";
import ChatWidget from '../components/ChatWidget';

export class EventView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      invitations: [],
      acceptedUsers: [],
      declineModalShow: false,
    };

    this.acceptInvitation = this.acceptInvitation.bind(this);
    this.declineInvitation = this.declineInvitation.bind(this);
    this.addInvitation = this.addInvitation.bind(this);
    this.editInvitation = this.editInvitation.bind(this);

    this.socket = io("http://localhost:3001/", {
      query: {
        room: props.match.params.id,
        token: window.localStorage['jwtToken']
      }
    });
  }

  getAcceptedusers(invitations){
    return [...invitations.filter(el => el.status === "accepted").map(el => el.to)];
  }

  componentDidMount() {
    this.socket.on("addInvitation", this.addInvitation);
    this.socket.on("editInvitation", this.editInvitation);  

    //get all invitations
    InvitationService.getInvitations(this.props.match.params.id).then((data) => {
      const myInvitation = data.find(el => el.to._id === UserService.getCurrentUser()._id);
      this.setState(Object.assign({}, this.state, { loading: false, invitations: data, myInvitation: myInvitation, acceptedUsers: this.getAcceptedusers(data) }));
    }).catch((e) => {
      this.setState(Object.assign({}, this.state, { loading: false }));
    });
  
  }

  // update the status in Invitations in database
  acceptInvitation(event)
  {
    event.preventDefault();     // To prevent default submission of the form
    const userID = UserService.getCurrentUser()._id;
    const eventId = this.props.match.params.id;
    const status = 'accepted'
    InvitationService.updateInvitations(eventId, userID, status).catch(console.error);
    this.props.history.push("/");
  }

  declineInvitation(event)
  {
    event.preventDefault();
    const userID = UserService.getCurrentUser()._id;
    const eventId = this.props.match.params.id;
    const status = 'rejected'
    InvitationService.updateInvitations(eventId, userID, status).catch(console.error);
    this.props.history.push("/");
  }

  componentWillUnmount() {
    this.socket.off("addInvitation");
    this.socket.off("editInvitation");
    this.socket.emit("leave", this.props.match.params.id);
  }

  addInvitation(invitation) {
    this.setState(Object.assign({}, this.state, {invitations: [...this.state.invitations, invitation]}));
  }

  editInvitation(invitation) {
    const data = [...this.state.invitations];
    const index = data.findIndex(el => el._id === invitation._id);
    if(index >= 0){
        data[index] = invitation;
        this.setState(Object.assign({}, this.state, {invitations: data, acceptedUsers: this.getAcceptedusers(data)}));
    }
  }

  render() {

    if (!this.state.myInvitation || this.state.myInvitation.status==="declined") return (
      <Page search={false} >

        <h1 style={{ color: "white", textAlign: "center", paddingTop: "200px" }}>{this.state.loading ? "Loading..." : "You are not invited! >:c"}</h1>

      </Page>
    );
    if (this.state.myInvitation.status==="pending") return (
      <Page search={false} >
        {this.state.loading ? " Loading ... " :
        <div>
          <EventDetail eventID={this.props.match.params.id}/>
        <div className=" row btn-toolbar d-sm-flex align-items-center mb-4 d-flex justify-content-center">
          <div className="h3 mb-0 text-gray-800">
            <Button onClick = { this.acceptInvitation } variant="primary" style={{"marginRight": "10px"}}>Accept </Button>
            <Button onClick = {() => this.setState(Object.assign({}, this.state, {declineModalShow: true}))} variant="danger"> Decline </Button>
            <ConfirmationModal
                title="Decline"
                show={this.state.declineModalShow}
                onHide={() => this.setState(Object.assign({}, this.state, {declineModalShow: false}))}
                onSubmit={this.declineInvitation}
              >
                    Are you sure you want to decline this invitation?
            </ConfirmationModal>
          </div>
        </div>
        </div>
        }

      </Page>
    );
    const isHost = this.state.myInvitation? this.state.myInvitation.asHost : false;


    return (
      <Page search={false} >
        <div id="content-wrapper" className="d-flex flex-column content-wrap">
          <div id="content" style={{ margin: "20px 50px" }}>

            <EventDetail eventID={this.props.match.params.id}/>
            <InvitationSection isHost={isHost} eventID={this.props.match.params.id} guests={this.state.invitations}/>

            <ItemTable socket={this.socket} eventID={this.props.match.params.id} asHost={isHost} users={this.state.acceptedUsers} />
            <div className="App"
            >

              {/* Chat Widget */}
              <ChatWidget
                socket={this.socket}
                eventID={this.props.match.params.id}
              />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

 