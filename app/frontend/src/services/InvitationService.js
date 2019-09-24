"use strict";

import HttpService from './HttpService';
import UserService from './UserService';

/**
 *
 */
export default class InvitationService {

    constructor() {
    }

    static baseURL() {
        return "http://localhost:3000/invitations"
    }

    static createInvitation(invitation, eventID) {
        return new Promise((resolve, reject) => {
            HttpService.post(`${this.baseURL()}/${eventID}`, invitation, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }

    static getInvitations(eventID) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${eventID}`, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }


    static updateInvitations(eventID, userID, status) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${eventID}/${status}`, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }
}