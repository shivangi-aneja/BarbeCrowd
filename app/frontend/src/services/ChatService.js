"use strict";

import HttpService from './HttpService';
import UserService from './UserService';

export default class ChatService {

    constructor() {
    }

    static baseURL() {return "http://localhost:3000/chat" }

    /**
     * sends a message to a User of an event
     */
    static sendMessage(eventID, userID, message) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${this.baseURL()}/${eventID}`, message, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }

    /**
     * Get all Chat messages of an Event
     */
    static getMessages(eventID){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${eventID}`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
     }

}

