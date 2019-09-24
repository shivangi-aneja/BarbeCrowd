"use strict";

import HttpService from './HttpService';

export default class EventService {

    constructor() {
    }

    static baseURL() { return "http://localhost:3000/events" }

    /**
     * @param {object} event contains name, time, location etc. of an event
     * @return {object} event object containing the database ID
     */
    static createEvent(event) {
        return new Promise((resolve, reject) => {
            HttpService.post(this.baseURL(), event, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }

    /**
     * send HTTP Request to the server to get all events located in mongoDB
     */
    static getEvents() {
        return new Promise((resolve, reject) => {
            HttpService.get(this.baseURL(), function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }



    /**
     * Send HTTP Request to the server to get specific event located in mongoDB
     */
    static getEvent(eventID) {
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${eventID}`, function (data) {
                resolve(data);
            }, function (textStatus) {
                reject(textStatus);
            });
        });
    }

}