"use strict";

import React from 'react';
import Page from '../components/Page';
import UserService from '../services/UserService';
import ChatService from '../services/ChatService';
import InvitationService from '../services/InvitationService';
import { Widget, addUserMessage, renderCustomComponent, dropMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import 'react-chat-elements/dist/main.css';
import { ChatItem } from 'react-chat-elements'
import EventService from '../services/EventService';


export class ChatWidget extends React.Component {
    constructor(props) {
        super(props);
        this.socket = props.socket;
        this.state = {
          loading: true,
          chatMessages: [],
          displayedMessages: [],
          eventName: ""
    
        };
    
        this.sendMessage = this.sendMessage.bind(this);
        this.loadChatMessages = this.loadChatMessages.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.getMessageTimeStamp = this.getMessageTimeStamp.bind(this);
        this.contains = this.contains.bind(this);
    
    
      }

      componentDidMount() {
        //listens for addMessage event
        this.socket.on("addMessage", this.addMessage);
        
        //laods all existing chatmessages and saves them in the state
        ChatService.getMessages(this.props.eventID).then((data) => {
          this.setState(Object.assign({}, this.state, { loading: false, chatMessages: data }));
          this.loadChatMessages();
        }).catch((e) => {
          this.setState(Object.assign({}, this.state, { loading: false, }));
        });

        //laods the Event name
        EventService.getEvent(this.props.eventID).then((data) => {
        this.setState(Object.assign({}, this.state, { oading: false, eventName: data.name}));
      }).catch((e) => {
        this.setState(Object.assign({}, this.state, { loading: false, }));
      });
  
      }

    /**
   * checks if an array of objects contains a specific object.
   * Used in loadChatMessages() to determine whether a message
   * has already been rendered in the chat or not.
   */
   contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i]._id === obj._id) {
            return true;
        }
    }
    return false;
}


  /**
   * Loads all chat messages and displays them in the chat.
   * Also checks if the messages have been already displayed.
   */
  loadChatMessages() {
    dropMessages();
    for (const chatMessage of this.state.chatMessages) {
      this.setState(Object.assign({}, this.state, {displayedMessages: [...this.state.displayedMessages, chatMessage]}));
      //if message was sent by the user itself
      if (chatMessage.userID._id === UserService.getCurrentUser()._id && this.contains(this.state.displayedMessages, chatMessage)) {
        addUserMessage(chatMessage.message.toString())
      } else {
          //if message was sent by another member
        if(this.contains(this.state.displayedMessages, chatMessage)){ 
          renderCustomComponent(ChatItem,
            {position: 'left',
            type: 'text',
            avatar: UserService.getProfilePictureOfUser(chatMessage.userID),
            title: chatMessage.userID.name,
            subtitle: chatMessage.message.toString(),
            date: this.getMessageTimeStamp(chatMessage)
          });
        }
        
      }
    }
  }

  getMessageTimeStamp(message){
    return new Date(parseInt(message._id.substring(0, 8), 16) * 1000);
  }

/** 
   * is called when socket notifies the client that a new message was sent
   * If the message was sent by the client itself it doesn't do anything
   * since the library automacally renders the message.
   * If the message was sent by someone else the method renders it.
   * 
  */
  
 addMessage(message) {
    this.setState(Object.assign({}, this.state, {chatMessages: [...this.state.chatMessages, message]}));
    if (message.userID._id === UserService.getCurrentUser()._id) {
      return;
    } else {
      renderCustomComponent(ChatItem,
        {position: 'left',
        type: 'text',
        title: message.userID.name,
        subtitle: message.message.toString(),
        avatar: UserService.getProfilePictureOfUser(message.userID)
      });
      this.setState(Object.assign({}, this.state, {displayedMessages: [...this.state.displayedMessages, message]}));
  }
}

 /**
   * Automtically called when the client sends a message.
   * Sends the message to server. Rendering is done by the library.
   */
  sendMessage(newMessage) {
    const messageObject = {
      message: newMessage
    }
    ChatService.sendMessage(this.props.eventID, UserService.getCurrentUser()._id, messageObject)
      .catch((e) => window.confirm(e));
  }

  render() {

    return (
      <Widget
      handleNewUserMessage={this.sendMessage}
      subtitle={this.state.eventName.toString()}
      title="Group chat"
      showCloseButton={true}
    />
    );
  }
}

export default ChatWidget;