"use strict";

import HttpService from './HttpService';

export default class NotificationService {

    constructor(){
    }

    static baseURL() {return "http://localhost:3000/notifications" }

    static getNotifications(getMessages){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${getMessages?"messages":"updates"}`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static countNotifications(getMessages){
        return new Promise((resolve, reject) => {
            HttpService.get(`${this.baseURL()}/${getMessages?"messages":"updates"}/count`, function(data) {
                resolve(data);
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static deleteNotifications(notifications) {
        const notificationIDs = notifications.map(e => e._id);
        return new Promise((resolve, reject) => {
            HttpService.remove(this.baseURL(), {ids: notificationIDs}, function(data) {
                if(data.message != undefined) {
                    resolve(data.message);
                } else {
                    reject('Error while deleting');
                }
            }, function(textStatus) {
                reject(textStatus);
            });
        });
    }

    static readNotification(notification) {
        return new Promise((resolve, reject) => {
            HttpService.put(`${this.baseURL()}/${notification._id}`, {}, function(data) {
                resolve(data);
            }, function(textStatus) {
               reject(textStatus);
            });
        });
    }
}